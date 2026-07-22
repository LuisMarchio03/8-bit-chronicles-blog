import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog02-pipeline-observability-instrumentation",
  title: "DevLog #02 – Instrumentando Observabilidade: Traces, Logs e Métricas",
  category: "DevLog",
  description:
    "Explorando os três pilares da observabilidade: traces distribuídos, logs estruturados e métricas. Implementação prática com Application Insights e Jaeger.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-13",
  tags: ["observabilidade", "opentelemetry", "jaeger", "serilog", "prometheus"],
  coverImage: "./coverimg-order-pipeline-02.jpg",
  series: "pipeline",
  content: `<h3>Os Três Pilares da Observabilidade</h3>
<p>Observabilidade é mais do que monitoramento. Está baseada em <strong>três pilares fundamentais</strong>:</p>
<ol>
<li><strong>Traces Distribuídos</strong> - Rastreiam uma requisição através de todos os serviços</li>
<li><strong>Logs Estruturados</strong> - Fornecem contexto detalhado dos eventos</li>
<li><strong>Métricas</strong> - Agregam dados quantitativos sobre o sistema</li>
</ol>
<h3>1. Traces Distribuídos com Jaeger</h3>
<p>Implementaremos traces distribuídos usando <strong>Jaeger</strong> integrado ao .NET via OpenTelemetry.</p>
<pre><code class="language-csharp">
// Configuração do TracerProvider
var tracerProvider = new TracerProviderBuilder()
    .AddAspNetCoreInstrumentation()
    .AddHttpClientInstrumentation()
    .AddOtlpExporter(opt =&gt; {
        opt.Endpoint = new Uri("http://jaeger:4317");
    })
    .Build();
</code></pre>
<h3>2. Logs Estruturados com Serilog</h3>
<p>Utilizaremos <strong>Serilog</strong> para estruturar os logs com contexto importante.</p>
<pre><code class="language-csharp">
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console(new RenderedCompactJsonFormatter())
    .WriteTo.ApplicationInsights(new TelemetryClient(), TelemetryConverter.Events)
    .CreateLogger();
</code></pre>
<h3>3. Métricas com Prometheus</h3>
<p>Coletaremos métricas usando <strong>OpenTelemetry Metrics API</strong> e exportando para Prometheus.</p>
<pre><code class="language-csharp">
var meter = new Meter("OrderPipeline.Metrics");
var orderCounter = meter.CreateCounter&lt;long&gt;(
    "orders.created",
    unit: "{order}",
    description: "Número de pedidos criados"
);
</code></pre>
<h3>Beneficiando-se da Observabilidade</h3>
<p>Com esses três pilares implementados, conseguimos:</p>
<ul>
<li>🔍 Investigar laços de desempenho em produção</li>
<li>📄 Entender o contexto completo de cada erro</li>
<li>📈 Monitorar tendências de desempenho ao longo do tempo</li>
<li>🚨 Alertar sobre anomalias rapidamente</li>
</ul>
<h3>Próximos Passos</h3>
<p>No próximo post, exploraremos padrões de <strong>resiliência</strong> como Retry e Circuit Breaker.</p>`,
}
