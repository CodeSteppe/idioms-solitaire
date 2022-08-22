const chart = createChart();

const graph1 = {
  nodes: [
    { id: "a" },
  ],
  links: []
}

const graph2 = {
  nodes: [
    { id: "a" },
    { id: "b" }
  ],
  links: [
    { source: "a", target: "b" }
  ]
}

const graph3 = {
  nodes: [
    { id: "a" },
    { id: "b" },
    { id: "c" }
  ],
  links: [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
    { source: "c", target: "a" }
  ]
}




setInterval(() => {
  chart.update(graph1);

  setTimeout(() => {
    chart.update(graph2);
  }, 3000)

  setTimeout(() => {
    chart.update(graph3);
  }, 6000)
}, 9000)
