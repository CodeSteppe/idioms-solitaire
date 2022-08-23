const width = window.innerWidth;
const height = window.innerHeight;
color = d3.scaleOrdinal(d3.schemeTableau10);

function createChart({ hanleClickNode }) {
  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);
    
  const transformer = svg.select('#transformer');

  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink().id(d => d.id).distance(200))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);

  let link = transformer.append("g")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5)
    .selectAll("line");

  let node = transformer.append("g").selectAll("g");

  function ticked() {

    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`)
  }

  function drag() {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }


  return Object.assign(svg.node(), {
    update({ nodes, links }) {

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map(d => [d.id, d]));
      nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      links = links.map(d => Object.assign({}, d));

      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart();


      node = node
        .data(nodes, d => d.id)
        .join(enter => {
          return enter.append((d) => {
            console.log('d', d)
            const node = document.querySelector('#node-template').content.firstElementChild.querySelector('.node').cloneNode(true);
            const text = node.querySelector('text');
            text.textContent = d.id;
            const circle = node.querySelector('circle');
            circle.style.fill = color(d.id);
            circle.style.r = d.id.length * 9;
            return node;
          })
        })
        .on('click', hanleClickNode)
        .call(drag());

      link = link
        .data(links, d => `${d.source.id}\t${d.target.id}`)
        .join("line")
        .attr("marker-end", d => `url(#arrow)`);
    }
  });
}