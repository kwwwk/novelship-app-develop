import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { toDate } from 'common/utils/time';
import { useQuery } from 'react-query';

import { Box, Text, ButtonBase } from 'app/components/base';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { CACHE_TIME, LB } from 'common/constants';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import {
  VictoryVoronoiContainer,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis,
  VictoryArea,
} from 'victory-native';

import theme from 'app/styles/theme';

const timePeriods = ['7D', '1M', '3M', '6M', '1Y', 'All'];

function LastSalePricesChart({ productId, size }: { size: string; productId: number }) {
  const [chartPeriod, setChartPeriod] = useState<string>('All');
  const { $toList } = useCurrencyUtils();

  const { data: priceHistoryList = [], isLoading } = useQuery<{ x: Date; y: number }[]>(
    `sales/price-history/${productId}/${encodeURIComponent(size)}/${chartPeriod}`,
    { staleTime: CACHE_TIME.long }
  );

  return (
    <>
      <Box mt={4} px={5} width="100%" flexDirection="row" justifyContent="space-between">
        {timePeriods.map((period, index) => (
          <ButtonBase
            key={index}
            onPress={() => setChartPeriod(period)}
            style={[
              { borderRadius: 4 },
              chartPeriod === period && { backgroundColor: theme.colors.black2 },
            ]}
          >
            <Text
              fontSize={2}
              fontFamily="bold"
              color={chartPeriod === period ? 'white' : 'gray2'}
              py={2}
              px={5}
            >
              {period}
            </Text>
          </ButtonBase>
        ))}
      </Box>

      <Box width="100%" center>
        {isLoading ? (
          <Box center height={200} mt={4}>
            <LoadingIndicator />
          </Box>
        ) : priceHistoryList.length === 0 ? (
          <Box height={200} mt={4} width="100%" center bg="gray7">
            <Text color="gray2" fontSize={1}>
              <Trans>No data available</Trans>
            </Text>
          </Box>
        ) : (
          <Box center width="100%">
            <VictoryChart
              height={240}
              containerComponent={
                <VictoryVoronoiContainer
                  labelComponent={
                    <VictoryTooltip
                      renderInPortal={false}
                      style={[
                        { fontSize: 11, fontFamily: theme.fonts.regular },
                        { fontSize: 10, fontFamily: theme.fonts.regular },
                      ]}
                      flyoutStyle={{ fill: 'white' }}
                      flyoutPadding={6}
                    />
                  }
                  labels={({ datum }) => `${$toList(datum.y)}${LB}${toDate(datum.x, 'DD/MM/YYYY')}`}
                />
              }
            >
              <VictoryAxis
                fixLabelOverlap
                theme={VictoryTheme.material}
                tickCount={6}
                tickFormat={(t) => toDate(t, 'D MMM')}
                style={{
                  axis: { stroke: theme.colors.gray6 },
                  ticks: { stroke: theme.colors.gray6, size: 4 },
                  tickLabels: {
                    fontSize: 10,
                    padding: 6,
                    fill: theme.colors.gray2,
                    fontFamily: theme.fonts.regular,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                theme={VictoryTheme.material}
                fixLabelOverlap
                tickCount={4}
                tickFormat={(t) => $toList(t)}
                style={{
                  axis: { stroke: 'transparent' },
                  grid: { stroke: theme.colors.gray6 },
                  tickLabels: {
                    fontSize: ({ text }) => (text.length > 10 ? 8 : 10),
                    padding: -18,
                    letterSpacing: 1,
                    fill: theme.colors.gray2,
                    fontFamily: theme.fonts.regular,
                  },
                }}
              />
              <VictoryArea
                data={priceHistoryList}
                style={{
                  data: {
                    fill: theme.colors.blue,
                    stroke: theme.colors.blue,
                    strokeWidth: 1.5,
                    fillOpacity: 0.1,
                  },
                }}
              />
            </VictoryChart>
          </Box>
        )}
      </Box>
    </>
  );
}

export default LastSalePricesChart;
