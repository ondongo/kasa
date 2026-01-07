'use client';

import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import * as d3Shape from 'd3-shape';
import { formatEuros } from '@/lib/money';

interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  size?: number;
  currency?: string;
}

export function DonutChart({ data, size = 300, currency = 'EUR' }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Créer le générateur de pie
    const pieGenerator = d3Shape.pie<any>()
      .value((d) => d.value)
      .sort(null);

    // Créer le générateur d'arc
    const arcGenerator = d3Shape.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcHover = d3Shape.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10);

    // Dessiner les segments
    const arcs = g
      .selectAll('path')
      .data(pieGenerator(data))
      .join('path')
      .attr('d', arcGenerator as any)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('class', 'transition-all duration-300 cursor-pointer')
      .on('mouseover', function (event, d) {
        select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover as any);
      })
      .on('mouseout', function (event, d) {
        select(this)
          .transition()
          .duration(200)
          .attr('d', arcGenerator as any);
      });

    // Ajouter les tooltips
    arcs.append('title').text((d) => `${d.data.label}\n${formatEuros(d.data.value, currency)}`);

    // Ajouter le total au centre
    const total = data.reduce((sum, d) => sum + d.value, 0);
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('class', 'text-2xl font-bold fill-current')
      .text(formatEuros(total, currency));

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('class', 'text-sm fill-muted-foreground')
      .text('Total');
  }, [data, size, currency]);

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Aucune donnée à afficher
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <svg ref={svgRef} width={size} height={size} className="drop-shadow-lg" />
      
      {/* Légende */}
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-foreground">
              {formatEuros(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

