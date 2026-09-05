import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function NetworkNodeGraph({ txs }: { txs: any[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !txs) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 300;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Pre-process nodes and links based on txs
    const nodes: any[] = [{ id: 'Root', group: 'root', label: 'Aegis Engine' }];
    const links: any[] = [];
    const identityNodes = new Set();
    const assetNodes = new Set();
    const credentialNodes = new Set();
    const deletedEntities = new Set();

    // First pass: identify deleted entities
    txs.forEach((tx) => {
      if (tx.blockchainOperation === 'DELETE_ASSET') {
        deletedEntities.add(`AST-${tx.entityId}`);
      } else if (tx.blockchainOperation === 'DELETE_IDENTITY') {
        deletedEntities.add(`ID-${tx.entityId}`);
      }
    });

    txs.forEach((tx) => {
      const group = tx.entityType?.toLowerCase() || 'unknown';
      let nodeId = '';
      if (group === 'identity') {
        nodeId = `ID-${tx.entityId}`;
        if (!deletedEntities.has(nodeId) && !identityNodes.has(nodeId)) {
          identityNodes.add(nodeId);
          nodes.push({ id: nodeId, group, label: `Identity #${tx.entityId}` });
          links.push({ source: 'Root', target: nodeId });
        }
      } else if (group === 'asset' || group === 'digitalasset') {
        nodeId = `AST-${tx.entityId}`;
        if (!deletedEntities.has(nodeId) && !assetNodes.has(nodeId)) {
          assetNodes.add(nodeId);
          nodes.push({ id: nodeId, group: 'asset', label: `Asset #${tx.entityId}` });
          links.push({ source: 'Root', target: nodeId });
        }
      } else if (group === 'credential') {
        nodeId = `CRD-${tx.entityId}`;
        if (!deletedEntities.has(nodeId) && !credentialNodes.has(nodeId)) {
          credentialNodes.add(nodeId);
          nodes.push({ id: nodeId, group, label: `Cred #${tx.entityId}` });
          // Link credential to its owner identity if possible
          const ownerId = `ID-${tx.userId || tx.ownerId}`;
          if (identityNodes.has(ownerId)) {
            links.push({ source: ownerId, target: nodeId });
          } else {
            links.push({ source: 'Root', target: nodeId });
          }
        }
      }
    });

    // If no txs, add some mock nodes to show something
    if (txs.length === 0) {
      ['ID-1', 'ID-2', 'AST-1', 'CRD-1'].forEach((id, i) => {
        nodes.push({ id, group: i < 2 ? 'identity' : (i === 2 ? 'asset' : 'credential'), label: id });
        links.push({ source: 'Root', target: id });
      });
    }

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(40));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    const colors: any = {
      root: '#3b82f6', // blue
      identity: '#10b981', // emerald
      asset: '#8b5cf6', // purple
      credential: '#f59e0b', // amber
      unknown: '#64748b' // slate
    };

    node.append('circle')
      .attr('r', (d: any) => d.id === 'Root' ? 16 : 10)
      .attr('fill', (d: any) => colors[d.group] || colors.unknown)
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dx', 15)
      .attr('dy', 4)
      .attr('fill', '#94a3b8')
      .style('font-size', '10px')
      .style('font-family', 'sans-serif')
      .text((d: any) => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [txs]);

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live Node Topology</span>
      </div>
      <svg ref={svgRef} className="w-full min-h-[300px] cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
}
