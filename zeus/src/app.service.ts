import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint } from './entity/endpoint.entity';
import { Graph } from './entity/graph.entity';
import { Filter } from './entity/filter.entity';

@Injectable()
export class AppService {
  constructor(private readonly entityManager: EntityManager,
    @InjectRepository(Endpoint) private endpointRepository: Repository<Endpoint>,
    @InjectRepository(Graph) private graphRepository: Repository<Graph>,
    @InjectRepository(Filter) private filterRepository: Repository<Filter>,
  ) { }

  async seedEndpointData(data: any): Promise<Object> {
    // JSON data
    const endpoints = data.endpoints;

    // Iterate through the JSON data and insert into the respective tables
    await this.entityManager.transaction(async manager => {
      for (const endpoint of endpoints) {
        const endpointEntity = new Endpoint();
        endpointEntity.endpoint = endpoint.endpoint;
        const endpointResult = await manager.save(endpointEntity);

        for (const graph of endpoint.graphs) {
          const graphEntity = new Graph();
          graphEntity.graphName = graph.name;
          graphEntity.user = graph.user;
          graphEntity.endpoint = endpointResult; // Correcting the relationship
          const graphResult = await manager.save(graphEntity);

          for (const filter of graph.filters) {
            const filterEntity = new Filter();
            filterEntity.name = filter.name;
            filterEntity.type = filter.type;
            filterEntity.input = filter.input;
            filterEntity.values = filter.values;
            filterEntity.graph = graphResult; // Correcting the relationship
            const filterResult = await manager.save(filterEntity);

          }
        }
      }
    });


    return {
      "success": "true"
    }
  }

  async editFilterData(data: any) {
    const existingData = await this.endpointRepository.find({ where: {endpoint : data.dataSource},
      relations: ['graphs', 'graphs.filters'],
    });

    if (!existingData || existingData.length === 0) {
      throw new NotFoundException('Data not found');
    }

    if (data.endpoint != null && data.typeOfUser && (data.filterId != null && data.filterId != -1) && data.data) {
      const filterIdGet = existingData[0].graphs.find(graph => graph.graphName === data.endpoint && graph.user === data.typeOfUser).filters.find(filter => filter.name === data.data.name);
      const filter = await this.filterRepository.findOne({ where: { id: filterIdGet.id } });
      if (filter) {
        const updateData = {
          input: data.data.input,
          name: data.data.name,
          type: data.data.type,
          values: data.data.values || filter.values // Keep existing values if new values are not provided
        };

        await this.filterRepository.update(filter.id, updateData);
        return { "status": "success" };
      }

      throw new NotFoundException('Filter not found');
    }
    // 6. Add Filter to Graph
    if (data.endpoint != null && data.typeOfUser && data.data && (data.filterId != null && data.filterId == -1)) {
      const graphGet = existingData[0].graphs.find(graph => graph.graphName === data.endpoint && graph.user === data.typeOfUser);
      const graph = await this.graphRepository.findOne({ where: { id: graphGet.id }, relations: ["filters"] });
      const filterEntity = new Filter();
      filterEntity.name = data.data.name;
      filterEntity.type = data.data.type;
      filterEntity.input = data.data.input;
      if (data.data.values) {
        filterEntity.values = data.data.values;
      }
      filterEntity.graph = graph; // Correcting the relationship
      await this.filterRepository.save(filterEntity);
    }

    throw new BadRequestException('Invalid request data');
  }

  async addGraph(data: any){
    const existingData = await this.endpointRepository.findOne({ where : {endpoint : data.endpoint},
      relations: ['graphs'],
    });
    if (!existingData) {
      throw new NotFoundException('Data not found');
    }
    for(const tou of data.graphData[0].tou){
      const graphEntity = new Graph();
      graphEntity.graphName = data.graphData[0].graphName;
      graphEntity.user = tou;
      graphEntity.endpoint = existingData;
      await this.graphRepository.save(graphEntity);
    }

    return {'status' : 'success'};

  }

  async editEndpointData(data: any) {
    const existingData = await this.endpointRepository.find({
      relations: ['graphs', 'graphs.filters'],
    });
    

    if (!existingData || existingData.length === 0) {
      throw new NotFoundException('Data not found');
    }

    if (data.endpointId) {
      const endpointIdGet = existingData[data.endpointId]
      const endpoint = await this.endpointRepository.findOne({ where: { id: endpointIdGet.id }, relations: ["graph", "graph.filters"] });
      if (endpoint) {
        const updateData = {
          endpoint: data.newData[0].endpoint,
          graphs: data.newData[0].graphs,
        };

        await this.graphRepository.update(endpoint.id, updateData);
        return { "status": "success" };
      }

      throw new NotFoundException('Filter not found');
    }
  }

  async getAllData(): Promise<Object> {
    return await this.endpointRepository.find({
      relations: ['graphs'], // Include necessary relations
    });
  }


  async getFiltersData(data: any): Promise<Object> {
    const existingData = await this.endpointRepository.find({ where : {endpoint : data.dataSource},
      relations: ['graphs', 'graphs.filters'],
    });
    console.log("hello");
    if (!existingData || existingData.length === 0) {
      throw new NotFoundException('Data not found');
    }

    if (data.dataSource && data.endpoint != null && data.typeOfUser ){
      const endpoint = existingData.at(0);
      const graph = await this.graphRepository.find({ where: { graphName : data.endpoint, user : data.typeOfUser}, relations: ["filters","endpoint"] });
      if(!graph){
        return {"status" : "error", "message" : "This endpoint does not exist for this type of user"};
      }
      for(let count = 0; count<graph.length; count++){
        if(graph.at(count).endpoint.endpoint == endpoint.endpoint){
          console.log("boi");
          return {"status" : "success", "filters" : graph.at(count).filters};
        }
      }
      return {"status" : "failure"};
    }
  }

}

