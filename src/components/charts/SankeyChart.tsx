'use client';

import { useEffect, useRef, useState } from 'react';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { select } from 'd3-selection';
import { formatEuros } from '@/lib/money';
import { SankeyData } from '@/lib/calculations';

interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

// Palette de couleurs personnalisée inspirée de #F2C086
const customColors: { [key: string]: string } = {
  // Revenus - tons verts
  income: '#10b981',
  salary: '#34d399',
  bonus: '#6ee7b7',
  
  // Dépenses - tons rouges/roses
  expense: '#ef4444',
  housing: '#f87171',
  food: '#fca5a5',
  transport: '#fb923c',
  entertainment: '#fdba74',
  
  // Investissements - tons bleus
  investment: '#3b82f6',
  stocks: '#60a5fa',
  crypto: '#93c5fd',
  savings: '#F2C086', // Votre couleur principale
  
  // Autres
  default: '#94a3b8',
};

function getNodeColor(nodeId: string, label: string): string {
  const lowerId = nodeId.toLowerCase();
  const lowerLabel = label.toLowerCase();
  
  // Revenus
  if (lowerId.includes('income') || lowerId.includes('revenu') || lowerLabel.includes('salaire')) {
    return customColors.income;
  }
  
  // Dépenses
  if (lowerId.includes('expense') || lowerId.includes('dépense')) {
    return customColors.expense;
  }
  if (lowerLabel.includes('logement') || lowerLabel.includes('loyer')) {
    return customColors.housing;
  }
  if (lowerLabel.includes('alimentation') || lowerLabel.includes('nourriture')) {
    return customColors.food;
  }
  if (lowerLabel.includes('transport')) {
    return customColors.transport;
  }
  if (lowerLabel.includes('loisir') || lowerLabel.includes('divertissement')) {
    return customColors.entertainment;
  }
  
  // Investissements
  if (lowerId.includes('investment') || lowerId.includes('investissement')) {
    return customColors.investment;
  }
  if (lowerLabel.includes('épargne') || lowerLabel.includes('savings')) {
    return customColors.savings;
  }
  
  return customColors.default;
}

export function SankeyChart({ data, width = 1000, height = 600 }: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 150, bottom: 20, left: 150 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Créer le générateur Sankey
    const sankeyGenerator = sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(20)
      .nodePadding(20)
      .extent([
        [1, 1],
        [innerWidth - 1, innerHeight - 5],
      ]);

    // Préparer les données
    const sankeyData: any = {
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({ ...l })),
    };

    // Générer le layout Sankey
    const { nodes, links } = sankeyGenerator(sankeyData);

    // Dessiner les liens avec dégradés
    const defs = svg.append('defs');
    
    links.forEach((link: any, i: number) => {
      const sourceColor = getNodeColor(link.source.id, link.source.label);
      const targetColor = getNodeColor(link.target.id, link.target.label);
      
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', link.source.x1)
        .attr('x2', link.target.x0);
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', sourceColor);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', targetColor);
    });

    // Dessiner les liens
    g.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any, i: number) => `url(#gradient-${i})`)
      .attr('stroke-width', (d: any) => Math.max(2, d.width))
      .attr('opacity', 0.4)
      .attr('class', 'transition-all duration-200')
      .on('mouseover', function (event: any, d: any) {
        select(this)
          .attr('opacity', 0.7)
          .attr('stroke-width', (d: any) => Math.max(3, d.width + 2));
      })
      .on('mouseout', function (event: any, d: any) {
        select(this)
          .attr('opacity', 0.4)
          .attr('stroke-width', (d: any) => Math.max(2, d.width));
      })
      .append('title')
      .text((d: any) => `${d.source.label} → ${d.target.label}\n${formatEuros(d.value)}`);

    // Dessiner les nœuds avec coins arrondis
    g.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', (d: any) => getNodeColor(d.id, d.label))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all duration-200 cursor-pointer')
      .on('mouseover', function () {
        select(this)
          .attr('opacity', 0.8)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function () {
        select(this)
          .attr('opacity', 1)
          .attr('stroke-width', 2);
      })
      .append('title')
      .text((d: any) => `${d.label}\n${formatEuros(d.value || 0)}`);

    // Ajouter les labels des nœuds avec fonds
    const labelGroup = g.append('g')
      .attr('font-family', 'system-ui, -apple-system, sans-serif')
      .attr('font-size', 13)
      .attr('font-weight', 500);

    labelGroup.selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 10 : d.x0 - 10))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < innerWidth / 2 ? 'start' : 'end'))
      .attr('fill', 'currentColor')
      .text((d: any) => d.label)
      .each(function(d: any) {
        // Ajouter la valeur sous le label
        const text = select(this);
        const x = text.attr('x');
        const y = text.attr('y');
        const anchor = text.attr('text-anchor');
        
        labelGroup.append('text')
          .attr('x', x)
          .attr('y', parseFloat(y) + 18)
          .attr('dy', '0.35em')
          .attr('text-anchor', anchor)
          .attr('fill', 'currentColor')
          .attr('opacity', 0.6)
          .attr('font-size', 11)
          .text(formatEuros(d.value || 0));
      });
  }, [data, dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.min(600, container.clientHeight),
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data.nodes.length) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Aucune donnée à afficher
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full" />
    </div>
  );
}

