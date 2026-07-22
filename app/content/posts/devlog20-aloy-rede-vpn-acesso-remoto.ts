import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog20-aloy-rede-vpn-acesso-remoto",
  title: "DevLog #20 – Aloy: Rede — VPN (Tailscale + WireGuard) e acesso remoto por QR",
  category: "DevLog",
  description:
    "DevLog #20 da Aloy. O último desta leva: alcançar a Aloy de qualquer lugar, com segurança. Integração com Tailscale e WireGuard, versão web servida na LAN, autenticação por QR code com worker-token e acesso remoto pelo celular via tailnet.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-19",
  tags: ["vpn", "tailscale", "wireguard", "seguranca", "qr", "acesso-remoto"],
  coverImage: "./coverimg-aloy-09.jpg",
  series: "aloy",
  content: `<p>Se a Aloy já comanda IAs em outros PCs e me atende no celular, faltava fechar a última peça: <strong>alcançar tudo isso de qualquer lugar, com segurança.</strong> Este é o último DevLog desta leva, e ele é sobre rede.</p>
<hr>
<h3>VPN: Tailscale e WireGuard</h3>
<p>Criei o módulo <code>vpn/</code> com dois provedores. O <strong>Tailscale</strong> entrou primeiro porque já estava de pé na máquina — dava pra ler <code>tailscale status</code> sem sudo. A Aloy ganhou uma visão do tailnet (este dispositivo online, IPs, lista de peers) e botões de conectar/desconectar. Aqui uma decisão de segurança: <strong>a LLM não liga nem desliga VPN</strong> — a tool <code>vpn_status</code> é só leitura; ações que mudam conectividade ficam na UI, com confirmação. Não quero a Aloy me derrubando da rede sozinha.</p>
<p>Depois veio o <strong>WireGuard</strong>, que exigiu resolver o problema do privilégio. Escolhi um <code>sudoers</code> NOPASSWD <strong>específico</strong>: um arquivo que libera sem senha <em>só</em> os binários <code>wg</code>/<code>wg-quick</code> pro meu usuário. O kernel <strong>nunca</strong> roda como root — ele monta os comandos com prefixo <code>sudo</code> configurável. Dois cuidados que valeram muito:</p>
<ul>
<li><strong>O parser omite as chaves.</strong> O <code>wg show all dump</code> despeja a chave privada e a preshared — elas <strong>nunca</strong> entram no dict, na API, no log ou no front. Mesmo princípio que apliquei aos dados do tailnet.</li>
<li><strong>Anti-injeção:</strong> o nome do túnel passa por uma allowlist estrita antes de chegar no shell-out, e os comandos são sempre uma lista de argumentos (nada de <code>shell=True</code>).</li>
</ul>
<hr>
<h3>Acesso pelo celular: a versão web + QR</h3>
<p>A Aloy também virou <strong>web</strong>: a mesma UI passou a ser servida na rede local pro celular. E a descoberta que encolheu o escopo foi boa — o CORS do backend já era aberto e o front deriva o host do backend a partir do <code>window.location</code>, então do celular ele bate no IP do PC automaticamente. Um botão "Versão web" gera um <strong>QR code</strong> com a URL; escaneou, abriu no celular.</p>
<p>(Teve até um bug engraçado: o cálculo do IP da LAN pegava a interface errada e retornava o IP da <em>VPN</em> em vez do Wi-Fi. Corrigi pra pular interfaces de docker/tailscale/tún e preferir a faixa 192.168.)</p>
<hr>
<h3>Fechando o buraco: autenticação por QR</h3>
<p>Servir na LAN sem auth significava que <strong>qualquer aparelho na mesma Wi-Fi</strong> batia direto no backend. Precisava trancar. A solução:</p>
<ul>
<li><strong>Um token compartilhado</strong> — reaproveitei o mesmo worker-token que já protegia os drivers remotos das sessões. Ele é auto-gerado no primeiro boot e guardado com permissão restrita; se não der pra gravar, cai num token efêmero em memória (never-crash até aqui).</li>
<li><strong>Um gate global</strong> — em vez de lembrar de proteger cada rota nova, um <code>WorkerAuthMiddleware</code> barra <strong>qualquer</strong> acesso não-local logo na entrada do app, HTTP e WebSocket. <em>Fail-closed</em> por padrão. O acesso local (loopback) sempre passa, então o desktop segue sem token.</li>
<li><strong>O pareamento</strong> — só o próprio desktop (via loopback) consegue ler o token, por uma rota <code>/api/pairing</code>. O QR já embute o token na URL; o celular escaneia, salva, e a URL é limpa do histórico pra o segredo não ficar em bookmark. Comparação de token é byte-a-byte, em tempo constante.</li>
</ul>
<hr>
<h3>E, por fim, de fora da Wi-Fi</h3>
<p>O último passo juntou as duas pontas: o QR passou a oferecer também uma URL do <strong>tailnet</strong>. Com o Tailscale ligado no celular, dá pra alcançar a Aloy <strong>de qualquer lugar</strong> — do 4G, na rua — não só na mesma Wi-Fi. E o melhor: <strong>zero backend novo</strong>, só reusei a leitura de status do Tailscale (do começo deste post) mais a auth por QR. Um seletor "Rede local | Tailscale" no modal, com os dois QRs pré-computados.</p>
<p>Fica o registro honesto da postura de segurança: na LAN o tráfego vai em claro (<code>http://</code>), então o escopo de confiança ali é "mesma Wi-Fi"; o acesso realmente externo é o que passa pela VPN. Sem TLS na rede local por enquanto — anotado.</p>
<hr>
<h3>Fim desta leva (mas não do projeto)</h3>
<p>E é isso! Nesta sequência de DevLogs a Aloy saiu de uma ideia num monorepo reescrito e virou uma assistente que ouve, fala, monitora a máquina, mexe na agenda, me conhece, age sozinha, comanda outras IAs e me atende de qualquer lugar — <strong>tudo local, privado e sob meu controle.</strong></p>
<p>Ainda tem bastante coisa no forno (vários smokes ao vivo, sync entre dispositivos, mais plataformas de IA) e o plano de abrir o projeto como open source segue de pé. Obrigado por acompanhar a jornada até aqui. 💜</p>
<hr>
<p>Me segue pros próximos capítulos do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>📸 <a href="https://www.instagram.com/luis_marchio/">https://www.instagram.com/luis_marchio/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
