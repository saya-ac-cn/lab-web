import React, { useState } from "react";
import {
    G2,
    Chart,
    Tooltip,
    Interval,
    Line,
    Point,
} from "bizcharts";

const Home = () => {


    const theme = getTheme();

    const data = [
        { name: 'London', month: 'Jan.', monthAverageRain: 18.9 },
        { name: 'London', month: 'Feb.', monthAverageRain: 28.8 },
        { name: 'London', month: 'Mar.', monthAverageRain: 39.3 },
        { name: 'London', month: 'Apr.', monthAverageRain: 81.4 },
        { name: 'London', month: 'May', monthAverageRain: 47 },
        { name: 'London', month: 'Jun.', monthAverageRain: 20.3 },
        { name: 'London', month: 'Jul.', monthAverageRain: 24 },
        { name: 'London', month: 'Aug.', monthAverageRain: 135.6 },
        { name: 'Berlin', month: 'Jan.', monthAverageRain: 12.4 },
        { name: 'Berlin', month: 'Feb.', monthAverageRain: 23.2 },
        { name: 'Berlin', month: 'Mar.', monthAverageRain: 34.5 },
        { name: 'Berlin', month: 'Apr.', monthAverageRain: 99.7 },
        { name: 'Berlin', month: 'May', monthAverageRain: 52.6 },
        { name: 'Berlin', month: 'Jun.', monthAverageRain: 35.5 },
        { name: 'Berlin', month: 'Jul.', monthAverageRain: 37.4 },
        { name: 'Berlin', month: 'Aug.', monthAverageRain: 42.4 },
    ];

    const average = data.reduce((pre, item) => {
        const { month, monthAverageRain } = item;
        if (!pre[month]) {
            pre[month] = 0
        }
        pre[month] += (monthAverageRain);
        return pre;
    }, {});

    const averageData = Object.keys(average).map(key => {
        return { month: key, averageRain: Number((average[key] / 2).toFixed(2)), name: 'avg' }
    })

    const colors = theme.colors10;

    return (
        <div>
            <Chart padding={[50,60]}
                   data={data}  autoFit={true}>
                <Tooltip shared/>
                <Interval adjust={[{type: 'dodge',marginRatio: 0,}]} color={["name", colors]} position="month*monthAverageRain"/>
                <Axis name='monthAverageRain' position='left' />
                <View data={averageData} scale={{averageRain: {min: 0,max: 100,alias: 'Average'}}} padding={0} >
                    <Axis name='averageRain' position='right' />
                    <Line position="month*averageRain" color={colors[2]}/>
                </View>
                {/*<Legend custom={true} items={[*/}
                {/*    {*/}
                {/*        name: "London", value: 'London', marker: {*/}
                {/*            symbol: 'square',*/}
                {/*            style: { fill: colors[0] }*/}
                {/*        }*/}
                {/*    },*/}
                {/*    {*/}
                {/*        name: "Berlin", value: 'Berlin', marker: {*/}
                {/*            symbol: 'square',*/}
                {/*            style: { fill: colors[1] }*/}
                {/*        }*/}
                {/*    },*/}
                {/*    {*/}
                {/*        name: "平均", value: 'avg', marker: {*/}
                {/*            symbol: 'hyphen',*/}
                {/*            style: { stroke: colors[2], lineWidth: 2 }*/}
                {/*        },*/}
                {/*    }]}*/}
                {/*/>*/}

            </Chart>

        </div>
    )
}

export default React.memo(Home)