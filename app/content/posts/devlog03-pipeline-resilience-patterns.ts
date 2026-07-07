import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog03-pipeline-resilience-patterns",
  title: "DevLog #03 – Padrões de Resiliência: Retry, Circuit Breaker e Bulkhead",
  category: "DevLog",
  description:
    "Implementando padrões avançados de resiliência no Order Pipeline. Exploramos Retry com exponential backoff, Circuit Breaker patterns e Bulkhead isolation.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-20",
  tags: ["resiliência", "polly", "circuit-breaker", "dotnet"],
  coverImage: "./coverimg-order-pipeline-03.jpg",
  content: `<h3>Por que Resiliência é Crítica</h3>
<p>Em uma arquitetura serverless event-driven, falhas são inevitáveis. A chave é <strong>recuperar-se rapidamente</strong>.</p>
<h3>1. Retry com Exponential Backoff</h3>
<p>Não tentamos novamente imediatamente. Usamos <strong>exponential backoff</strong>:</p>
<pre><code class="language-csharp">
public async Task&lt;T&gt; ExecuteWithRetryAsync&lt;T&gt;(
    Func&lt;Task&lt;T&gt;&gt; operation,
    int maxAttempts = 3)
{
    for (int attempt = 0; attempt &lt; maxAttempts; attempt++)
    {
        try
        {
            return await operation();
        }
        catch (Exception ex) when (attempt &lt; maxAttempts - 1)
        {
            var delay = TimeSpan.FromMilliseconds(Math.Pow(2, attempt) * 100);
            await Task.Delay(delay);
        }
    }
}
</code></pre>
<h3>2. Circuit Breaker Pattern</h3>
<p>Evitamos cascata de falhas parando de chamar um serviço que está falhando.</p>
<pre><code class="language-csharp">
var circuitPolicy = Policy
    .Handle&lt;HttpRequestException&gt;()
    .OrResult&lt;HttpResponseMessage&gt;(r =&gt; !r.IsSuccessStatusCode)
    .CircuitBreakerAsync&lt;HttpResponseMessage&gt;(
        handledEventsAllowedBeforeBreaking: 5,
        durationOfBreak: TimeSpan.FromSeconds(30),
        onBreak: (outcome, timespan) =&gt;
        {
            _logger.LogWarning($"Circuit breaker aberto por {timespan.TotalSeconds}s");
        }
    );
</code></pre>
<h3>3. Bulkhead Isolation</h3>
<p>Isolamos recursos para que uma falha não afete todo o sistema.</p>
<pre><code class="language-csharp">
var bulkheadPolicy = Policy.BulkheadAsync(
    maxParallelization: 10,
    maxQueuingActions: 5,
    onBulkheadRejectionAsync: context =&gt;
    {
        _logger.LogWarning("Bulkhead rejeitou requisição");
        return Task.CompletedTask;
    }
);
</code></pre>
<h3>Combinando Padrões</h3>
<p>Combinamos esses padrões em uma <strong>Polly Policy</strong> única:</p>
<pre><code class="language-csharp">
var policyWrap = Policy.WrapAsync(
    retryPolicy,
    circuitBreakerPolicy,
    bulkheadPolicy
);
</code></pre>
<h3>Conclusão</h3>
<p>Com esses padrões, nosso Order Pipeline pode se recuperar de falhas <strong>automaticamente</strong> e evitar cascatas de erro.</p>`,
}
