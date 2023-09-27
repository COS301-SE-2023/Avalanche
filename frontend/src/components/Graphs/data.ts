export const chartColours: string[] = [
    "#2196F3",  // Blue
    "#FFC107",  // Amber
    "#4CAF50",  // Green
    "#3F51B5",   // Indigo
    "#F44336",  // Red
    "#9C27B0",  // Purple
    "#673AB7",  // Deep Purple
    "#009688",  // Teal
    "#FF5722",  // Deep Orange
    "#607D8B",  // Blue Grey
    "#FFEB3B",  // Yellow
    "#8BC34A"  // Light Green

];

export const borderColours = [
    '#f72585',
    '#B5179E',
    '#7209B7',
    '#560BAD',
    '#480CA8',
    '#3A0CA3',
    '#3F37C9',
    '#4361EE',
    '#4895EF',
    '#4CC9F0',
    '#DC136C',
    '#2CF6B3',
    '#FFD447',
    '#320D6D',
    '#F72C25',
    '#A30015',
    '#072AC8'
];

export const chartData = {
    "labels": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    "datasets": [
        {
            "label": "AFRICA_NEW",
            "data": [
                932,
                1286,
                1220,
                858,
                935,
                839,
                760,
                802,
                802,
                894,
                847,
                701
            ],
            backgroundColor: chartColours
        },
        {
            "label": "AFRICA_PREMIUM",
            "data": [
                19,
                17,
                27,
                18,
                16,
                8,
                13,
                23,
                16,
                6,
                12,
                14
            ],
            backgroundColor: chartColours
        },
        {
            "label": "AFRICA_RENEW",
            "data": [
                1147,
                1244,
                1147,
                1326,
                1785,
                2019,
                2691,
                2106,
                1298,
                1370,
                1155,
                1218
            ],
            backgroundColor: chartColours
        },
        {
            "label": "AFRICA_TRANSFER",
            "data": [
                39,
                80,
                97,
                83,
                83,
                199,
                69,
                69,
                73,
                56,
                47,
                33
            ],
            backgroundColor: chartColours
        },
        {
            "label": "AFRICA_CLOSED_REDEEM",
            "data": [
                6,
                5,
                0,
                40,
                19,
                36,
                29,
                22,
                15,
                22,
                24,
                25
            ],
            backgroundColor: chartColours
        },
        {
            "label": "AFRICA_GRACE",
            "data": [
                5,
                10,
                5,
                5,
                4,
                5,
                3,
                4,
                5,
                12,
                6,
                3
            ],
            backgroundColor: chartColours
        }
    ]
}
