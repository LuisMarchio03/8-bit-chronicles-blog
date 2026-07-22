import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog21-aloy-ux-mobile-nav-inferior",
  title: "DevLog #21 – Aloy: UX mobile — nav inferior, safe-area e painel único",
  category: "DevLog",
  description:
    "DevLog #21 da Aloy. Alcançar a Aloy pelo celular era o #20; usá-la é outra história. Barra de navegação inferior, safe-area do notch, cockpit em painel único — e um post em que boa parte da entrega foi descobrir o que NÃO precisava ser feito.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-20",
  tags: ["mobile", "ux", "responsivo", "nextjs", "frontend"],
  coverImage: "./coverimg-aloy-10.jpg",
  series: "aloy",
  content: `<p>O DevLog #20 fechou o problema de <strong>alcançar</strong> a Aloy de qualquer lugar: VPN, versão web, QR code. Só que alcançar e <em>usar</em> são coisas diferentes. Abri a UI no celular e ela era, honestamente, uma tela de desktop encolhida. Este devlog é sobre fechar a linha "versão web / celular" pelo lado da experiência no aparelho.</p>
<p>Escopo: <strong>só frontend</strong>, reusando a base responsiva que já existia (o drawer e o <code>useIsMobile</code>). Nenhuma linha de backend.</p>
<hr>
<h3>A nav que cabe no polegar</h3>
<p>No desktop a navegação vive numa sidebar. No celular, sidebar é justamente o que ninguém quer abrir a cada troca de aba. Então a navegação principal desceu pro rodapé.</p>
<p>A primeira decisão foi <strong>não</strong> deixar a lista de abas primárias enterrada dentro do componente. Ela virou <code>lib/nav.ts</code>, com <code>PRIMARY_NAV_IDS</code> (chat, sessões, arquivos, system) e as funções <code>primaryNavItems()</code>/<code>overflowNavItems()</code>. O motivo é bobo e vale sempre: assim eu consigo <strong>testar</strong> a regra — que a ordem é a esperada, que primárias + overflow cobrem o conjunto todo, e que nenhum item aparece duas vezes. São 4 testes que não dependem de renderizar nada.</p>
<p>Aí veio a barra em si (<code>app/mobile-nav.tsx</code>): as 4 primárias com ícone e label, mais um botão <strong>"⋯ Mais"</strong> que abre o drawer com o resto (Discord, Calendar, Memória, Lembretes, VPN). Três detalhes que fazem a diferença entre "tem nav" e "dá pra usar":</p>
<ul>
<li><strong>Alvo de toque ≥52px.</strong> Dedo não é cursor.</li>
<li><strong><code>pb-[env(safe-area-inset-bottom)]</code></strong> — senão a barra fica embaixo da barra de gestos do sistema.</li>
<li><strong>Renderizada abaixo do <code>&lt;main&gt;</code></strong>, empilhada, e só quando <code>sidebar.isMobile</code>. Isso não é detalhe de CSS: se ela fosse sobreposta, cobriria o input do chat — que é, afinal, a coisa mais usada do app inteiro.</li>
</ul>
<p>No desktop, nada disso monta. O visual continua idêntico.</p>
<hr>
<h3>O notch</h3>
<p>O topbar tinha <code>h-12</code>. Num aparelho com notch, isso significa altura fixa de 48px <em>competindo</em> com o inset do sistema — e o conteúdo do header sendo clipado.</p>
<p>A correção foram duas linhas: <code>pt-[env(safe-area-inset-top)]</code> no mobile, e <code>h-12</code> → <code>min-h-12</code>. A troca de <code>h-</code> por <code>min-h-</code> é o ponto: o header passa a <strong>crescer</strong> com o inset em vez de brigar com ele. Sem notch, <code>min-h-12</code> se comporta exatamente como <code>h-12</code> — por isso o desktop não mudou um pixel.</p>
<hr>
<h3>Metade do trabalho já estava feita</h3>
<p>Aqui o devlog fica interessante. O plano previa transformar o cockpit de sessões em painel único no mobile (hoje ele é lista + transcript lado a lado). Fui implementar e descobri que <strong>já estava feito</strong> — por trabalho em paralelo, e <em>melhor do que o plano previa</em>.</p>
<p>Quem fez extraiu <code>lib/cockpit-pane.ts</code> com <code>cockpitPane({isMobile, selectedId}) → list|detail|split</code>, <strong>com teste</strong>. O <code>cockpit.tsx</code> já alternava lista/transcript com um "← Sessões", e o <code>session-list.tsx</code> já era <code>w-full md:w-[300px]</code>. Também já havia <code>h-[100dvh]</code> no shell e <code>p-3 md:p-6</code> nas abas de Memória e Lembretes.</p>
<p>A tentação, quando você abre o editor com um plano na mão, é implementar o que o plano manda. Eu só <strong>verifiquei e não dupliquei</strong>. Vale registrar que parte da entrega deste dia foi exatamente isso: ler o que já existe antes de escrever por cima.</p>
<hr>
<h3>A varredura que não achou nada</h3>
<p>Último item do plano: caçar overflow horizontal — aquele scroll lateral que aparece do nada e denuncia layout de desktop no celular.</p>
<p>Varri as seções primárias (Chat, Arquivos, System, VPN) e encontrei todas já responsivas: <code>flex-wrap</code>, larguras em <code>%</code>, <code>max-w-[..]</code> com <code>truncate</code>. O único suspeito era um <code>min-w-[10rem]</code> num Select da aba Arquivos — mas ele vive dentro de um container <code>flex-wrap</code>, então <strong>quebra a linha em vez de estourar</strong>.</p>
<p>Conclusão: <strong>nada a envolver em <code>overflow-x-auto</code></strong>. Zero mudanças.</p>
<p>Anoto isso no devlog de propósito. Uma varredura que termina em "não faça nada" parece desperdício, mas é o oposto: é a diferença entre saber que o layout está bom e <em>achar</em> que está. E o custo de "consertar" o que não está quebrado seria um <code>overflow-x-auto</code> defensivo em cada seção, escondendo o próximo bug de verdade.</p>
<hr>
<h3>O que ficou de fora</h3>
<p>Gestos e swipe, redesign denso por seção (Discord e Calendar ainda são telas de desktop apertadas), e um redesign mobile completo. Nada disso bloqueia o uso — e o objetivo do dia era <em>bom</em>, não <em>perfeito</em>.</p>
<p><strong>Testes:</strong> frontend com <strong>122 vitest passando</strong> (24 arquivos, sendo +4 do split de nav), <code>tsc --noEmit</code> limpo, <code>next build</code> compilando. Backend intacto — não toquei nele.</p>
<p><strong>Smoke visual:</strong> pendente, e é manual por natureza. Em viewport de celular (~390×844) e depois no aparelho real via QR: a nav inferior com as 4 + "Mais", o drawer abrindo com o resto, o cockpit virando painel único, sem scroll lateral — e no desktop tudo voltando ao normal. É o tipo de coisa que nenhum teste unitário me dá.</p>`,
}
