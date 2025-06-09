import Chart from "react-apexcharts";
import { useState } from "react";

export const FinancialReport = ({ style }) => {
  console.count("Financial Report: ");
  const [series, setSeries] = useState([
    {
      name: "Revenue",
      data: [
        1000,
        1200,
        800,
        1100,
        1300,
        1400,
        1500,
        1600,
        1800,
        2000,
        2200,
        2400,
      ],
    },
    {
      name: "Expenses",
      data: [800, 900, 700, 850, 950, 1000, 1050, 1100, 1200, 1300, 1400, 1500],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      height: 300,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2022-01-01T00:00:00.000Z",
        "2022-02-01T00:00:00.000Z",
        "2022-03-01T00:00:00.000Z",
        "2022-04-01T00:00:00.000Z",
        "2022-05-01T00:00:00.000Z",
        "2022-06-01T00:00:00.000Z",
        "2022-07-01T00:00:00.000Z",
        "2022-08-01T00:00:00.000Z",
        "2022-09-01T00:00:00.000Z",
        "2022-10-01T00:00:00.000Z",
        "2022-11-01T00:00:00.000Z",
        "2022-12-01T00:00:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div
        className={`card p-3 shadow rounded border-0 h-100 d-flex flex-column justify-content-between`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">Financial Report</h6>
          <div className="d-flex justify-content-between">
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Monthly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Weekly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Daily
            </button>
          </div>
        </div>
        <div className="h-100">
          <Chart options={options} series={series} type="area" height={300} />
        </div>
      </div>
    </div>
  );
};

export const UserInflow = ({ style }) => {
  console.count("User Inflow: ");
  const [series, setSeries] = useState([
    {
      name: "Users",
      data: [
        1000,
        1200,
        800,
        1100,
        1300,
        1400,
        1500,
        1600,
        1800,
        2000,
        2200,
        2400,
      ],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      height: 300,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2022-01-01T00:00:00.000Z",
        "2022-02-01T00:00:00.000Z",
        "2022-03-01T00:00:00.000Z",
        "2022-04-01T00:00:00.000Z",
        "2022-05-01T00:00:00.000Z",
        "2022-06-01T00:00:00.000Z",
        "2022-07-01T00:00:00.000Z",
        "2022-08-01T00:00:00.000Z",
        "2022-09-01T00:00:00.000Z",
        "2022-10-01T00:00:00.000Z",
        "2022-11-01T00:00:00.000Z",
        "2022-12-01T00:00:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div
        className={`card p-3 shadow rounded border-0 h-100 d-flex flex-column justify-content-between`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">User Inflow</h6>
          <div className="d-flex justify-content-between">
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Monthly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Weekly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Daily
            </button>
          </div>
        </div>
        <div className="h-100">
          <Chart options={options} series={series} type="area" height={300} />
        </div>
      </div>
    </div>
  );
};

export const Issues = ({ style }) => {
  const [options, setOptions] = useState({
    colors: ["#5FB989", "#002669"],
    labels: ["Open", "Closed"],
  });
  const [series, setSeries] = useState([472, 408]);

  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div
        className={`card p-3 shadow rounded border-0 h-100 d-flex flex-column justify-content-between`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">Issues</h6>
          <div className="d-flex justify-content-between">
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Monthly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Weekly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Daily
            </button>
          </div>
        </div>
        <div className="h-100">
          <Chart options={options} series={series} type="pie" />
        </div>
      </div>
    </div>
  );
};

export const ComplaintType = ({ style }) => {
  const [options, setOptions] = useState({
    colors: ["#FF4560", "#008FFB", "#00E396", "#FEB019"],
    labels: ["Failed Transactions", "Wrong Items", "Incomplete Items", "Other"],
  });
  const [series, setSeries] = useState([528, 429, 510, 472]);

  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div
        className={`card p-3 shadow rounded border-0 h-100 d-flex flex-column justify-content-between`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">Complaints Type</h6>
          <div className="d-flex justify-content-between">
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Monthly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Weekly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Daily
            </button>
          </div>
        </div>
        <div className="h-100">
          <Chart options={options} series={series} type="donut" />
        </div>
      </div>
    </div>
  );
};

export const Target = ({ style }) => {
  const [options, setOptions] = useState({
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            offsetY: 20,
            show: true,
            color: "#636363",
            fontFamily: 'Open Sans',
          },
          value: {
            offsetY: -20,
            color: "#111",
            fontFamily: 'Open Sans',
            show: true,
          },
        },
      },
    },
    fill: {
      opacity: 1.5,
      colors: ['#28C76F'],
      type: 'solid',
  },
    stroke: {
      lineCap: ["round"],
    },
    labels: ["Achieved"],
  });
  const [series, setSeries] = useState([63]);

  return (
    <div className={`${style} mb-3 mb-md-0 Targets`}>
      <div
        className={`card p-3 shadow rounded border-0 h-100 d-flex flex-column justify-content-between`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">Target</h6>
          <div className="d-flex justify-content-between">
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Monthly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Weekly
            </button>
            <button className="border-0 px-1 bg-transparent pFont opacity-50 text-small switch-charts-btn">
              Daily
            </button>
          </div>
        </div>
        <div className="h-100">
          <Chart options={options} series={series} type="radialBar" height={250}/>
        </div>
      </div>
    </div>
  );
};


export const LineSparkline = () => {
  const [options, setOptions] = useState({
    series: [{
      data: [25, 66, 41, 89, 63, 90, 95, 200]
    }],
    chart: {
      type: 'line',
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      width: 1.5,
      curve: 'straight',
      colors: ['#006747']
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false
      }
    }
  });
  return (
    <Chart options={options} series={options.series} type="line" height={30} width={24} />
  );
};
