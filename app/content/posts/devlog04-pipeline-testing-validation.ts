import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog04-pipeline-testing-validation",
  title: "DevLog #04 – Testing e Validação: Garantindo Confiabilidade",
  category: "DevLog",
  description:
    "Finalizando o DEVLOG com estratégias de testes end-to-end, unit tests, integration tests e chaos engineering para garantir a confiabilidade do Order Pipeline.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-27",
  tags: ["testes", "xunit", "testcontainers", "k6", "chaos-engineering"],
  coverImage: "./coverimg-order-pipeline-04.jpg",
  series: "pipeline",
  content: `<h3>Uma Arquitetura Robusta Precisa de Testes Robustos</h3>
<p>Observabilidade e resiliência são fundamentais, mas precisamos <strong>validar que tudo funciona</strong> antes de ir para produção.</p>
<h3>1. Unit Tests para Lógica de Negócio</h3>
<p>Testamos cada componente isoladamente com xUnit:</p>
<pre><code class="language-csharp">
[Fact]
public async Task ProcessOrder_WithValidPayload_ShouldCreateEvent()
{
    // Arrange
    var handler = new OrderProcessingHandler(_logger, _mediator);
    var command = new ProcessOrderCommand { OrderId = 123, Amount = 100 };

    // Act
    await handler.Handle(command, CancellationToken.None);

    // Assert
    _mediator.Verify(m =&gt; m.Publish(
        It.IsAny&lt;OrderCreatedEvent&gt;(), 
        It.IsAny&lt;CancellationToken&gt;()),
        Times.Once);
}
</code></pre>
<h3>2. Integration Tests com Testcontainers</h3>
<p>Testamos com infraestrutura real (RabbitMQ, databases) usando Testcontainers:</p>
<pre><code class="language-csharp">
public class OrderPipelineIntegrationTests : IAsyncLifetime
{
    private readonly RabbitMQContainer _container = 
        new RabbitMQBuilder().WithImage("rabbitmq:3-management").Build();

    public async Task InitializeAsync() =&gt; await _container.StartAsync();
    public async Task DisposeAsync() =&gt; await _container.StopAsync();

    [Fact]
    public async Task OrderEvent_PublishedToQueue_ShouldBeConsumed()
    {
        // Arrange
        var connection = new ConnectionFactory { Uri = _container.GetConnectionString() };
        
        // ... test implementation
    }
}
</code></pre>
<h3>3. Chaos Engineering com Gremlin</h3>
<p>Simulamos falhas em produção de forma controlada:</p>
<pre><code class="language-csharp">
// Simular latência aleatória
var chaosPolicy = Policy
    .Handle&lt;HttpRequestException&gt;()
    .Or&lt;TimeoutException&gt;()
    .InjectLatencyAsync(
        delay: TimeSpan.FromSeconds(5),
        injectionRate: 0.1, // 10% das requisições
        enabled: () =&gt; _isLoadTest);
</code></pre>
<h3>4. Load Testing com k6</h3>
<p>Testamos sob carga para identificar gargalos:</p>
<pre><code class="language-javascript">
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)&lt;500'],
    http_req_failed: ['rate&lt;0.1'],
  },
};

export default function() {
  let response = http.post('http://order-pipeline/api/orders', {
    productId: 123,
    quantity: 5,
  });
  check(response, {
    'status is 201': (r) =&gt; r.status === 201,
  });
  sleep(1);
}
</code></pre>
<h3>Resultados: Um Sistema de Confiança</h3>
<p>Com esses testes em lugar, temos:</p>
<ul>
<li>✅ Confiabilidade verificada em cada commit</li>
<li>✅ Comportamento sob carga documentado</li>
<li>✅ Recuperação de falhas testada</li>
<li>✅ Regressões evitadas automaticamente</li>
</ul>
<h3>Conclusão</h3>
<p>Construímos um <strong>Order Pipeline robusto, observável e resiliente</strong>. Este DEVLOG explorou:</p>
<ol>
<li>🏗️ Arquitetura Event-Driven Serverless</li>
<li>📈 Observabilidade com Traces, Logs e Métricas</li>
<li>🛡️ Padrões de Resiliência</li>
<li>🪨 Testing e Validação</li>
</ol>
<p><strong>Próximos passos?</strong> Deploy em produção com confiança! 🚀</p>`,
}
