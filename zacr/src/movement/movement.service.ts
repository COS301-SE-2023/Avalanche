import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class MovementService {
    constructor(
        private jwtService: JwtService,
        @Inject('REDIS') private readonly redis: Redis,
        private readonly snowflakeService: SnowflakeService,
        private readonly statisticalAnalysisService: AnalysisService,
        private readonly graphFormattingService: GraphFormatService,
    ) { }

    async nettVeritical(filters: string, graphName: string): Promise<any> {
        graphName = this.netVerticalGraphName(filters);

        filters = JSON.stringify(filters);
        console.log(filters);
        const sqlQuery = `call nettVerticalMovement('${filters}')`;

        let formattedData = await this.redis.get(sqlQuery);

        if (!formattedData) {
            const queryData = await this.snowflakeService.execute(sqlQuery);
            // const analyzedData = await this.statisticalAnalysisService.analyze(
            //   queryData,
            // );
            formattedData = await this.graphFormattingService.formatNettVertical(
                JSON.stringify(queryData),
            );

            await this.redis.set(sqlQuery, formattedData, 'EX', 24 * 60 * 60);
        }

        filters = JSON.parse(filters);

        return {
            status: 'success',
            data: { graphName: graphName, ...JSON.parse(formattedData) },
            timestamp: new Date().toISOString(),
        };
    }

    netVerticalGraphName(filters: string): string {
        let registrar = filters['registrar'];
        if (registrar) {
            if (registrar.length > 0) {
                var regArr = [];
                for (var r of registrar) {
                    regArr.push(r);
                }
                registrar += regArr.join(", ");
            }
        } else {
            registrar = ' all registrars ';
        }

        let zone = filters['zone'];
        if (zone) {
            if (zone.length > 0) {
                var zoneArr = [];
                for (var r of zone) {
                    zoneArr.push(r);
                }
                zone += zoneArr.join(", ");
            }
            zone = ' for ' + zone;
        } else {
            zone = ' all zones in registry';
        }

        var dateFrom;
        if (filters['dateFrom'] === undefined) {
            dateFrom = new Date();
            dateFrom.setFullYear(dateFrom.getUTCFullYear() - 1);
            dateFrom = dateFrom.getFullYear() + "-01-01";
        } else {
            dateFrom = new Date(filters['dateFrom']);
            var month = dateFrom.getUTCMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = dateFrom.getUTCDate();
            day = day < 10 ? "0" + day : day;
            dateFrom =
                dateFrom.getUTCFullYear() + "-" + month + "-" + day;
        }

        var dateTo;
        if (filters['dateTo'] === undefined) {
            dateTo = new Date();
            dateTo.setFullYear(dateTo.getUTCFullYear() - 1);
            dateTo = dateTo.getFullYear() + "-12-31";
        } else {
            dateTo = new Date(filters['dateTo']);
            var month = dateTo.getUTCMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = dateTo.getUTCDate();
            day = day < 10 ? "0" + day : day;
            dateTo =
                dateTo.getUTCFullYear() + "-" + month + "-" + day;
        }

        var granularity = 'Monthly ';
        var gCheck = filters['granularity'];

        if (gCheck == "year") {
            granularity = 'Yearly ';
        } else if (gCheck == "week") {
            granularity = 'Weekly ';
        } else if (gCheck == "day") {
            granularity = 'Daily ';
        }

        return granularity + ' Nett Vertical Movement (Creates-Deletes) from ' + dateFrom + ' to ' + dateTo + ' for ' + registrar + zone;
    }
}
