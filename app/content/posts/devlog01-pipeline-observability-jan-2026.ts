import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog01-pipeline-observability-jan-2026",
  title: "DevLog #01 – Order Pipeline: Arquitetura Event-Driven Serverless",
  category: "DevLog",
  description:
    "Iniciando o DEVLOG sobre observabilidade e resiliência em arquiteturas event-driven serverless com C#/.NET. Discutindo a estrutura geral do projeto Order Pipeline.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-06",
  tags: ["dotnet", "event-driven", "serverless", "observabilidade"],
  coverImage: "./coverimg-order-pipeline-01.jpg",
  content: `<h3>Introdução</h3>
<p>Após criar o repositório completo para o projeto <strong>Order Pipeline</strong>, estou iniciando um DEVLOG detalhado sobre <strong>observabilidade e resiliência em arquiteturas event-driven serverless com C#/.NET</strong>.</p>
<p>Neste primeiro post, vamos explorar:</p>
<ul>
<li>🏗️ Visão geral da arquitetura event-driven</li>
<li>☁️ Por que serverless é a escolha ideal</li>
<li>📊 Fundamentos de observabilidade</li>
<li>🛡️ Estratégias de resiliência</li>
</ul>
<h3>A Arquitetura Event-Driven</h3>
<p>Uma arquitetura event-driven é baseada em <strong>eventos</strong> como a unidade fundamental de comunicação entre componentes.</p>
<p>No contexto do Order Pipeline:</p>
<ul>
<li><strong>OrderCreated</strong> – Disparado quando um novo pedido é criado</li>
<li><strong>OrderProcessed</strong> – Disparado quando o pedido entra em processamento</li>
<li><strong>OrderShipped</strong> – Disparado quando o pedido é enviado</li>
<li><strong>OrderCancelled</strong> – Disparado quando um pedido é cancelado</li>
</ul>
<p>Cada evento flui através de um <strong>message broker</strong> (como RabbitMQ ou Azure Service Bus), permitindo desacoplamento entre os serviços.</p>
<h3>Serverless e Cloud-Native</h3>
<p>No contexto de C#/.NET, utilizamos <strong>Azure Functions</strong> ou <strong>AWS Lambda</strong> para executar nossas lógicas de negócio em resposta a eventos.</p>
<p>Benefícios:</p>
<ul>
<li>✅ Escalabilidade automática</li>
<li>✅ Pagamento apenas pelo uso (pay-per-execution)</li>
<li>✅ Gerenciamento automático de infraestrutura</li>
<li>✅ Integração nativa com serviços cloud</li>
</ul>
<h3>O que esperar nos próximos posts</h3>
<p>Continuaremos explorando implementações práticas de observabilidade e resiliência no Order Pipeline. Fique ligado! 🚀</p>`,
}
