import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog01-brigid-voltando-ao-tcc",
  title: "DevLog #01 – BrigidAI: Voltando ao TCC — o que a concepção original errou",
  category: "DevLog",
  description:
    "DevLog #01 do BrigidAI. Estou voltando ao projeto que nasceu como meu TCC: apoio ao diagnóstico de Parkinson por ressonância magnética. A primeira coisa que fiz foi uma autópsia da minha própria concepção — e ela não sobreviveu inteira.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-15",
  tags: ["parkinson", "ia-medica", "dotnet", "pesquisa", "mri", "dicom"],
  coverImage: "./coverimg-brigid-01.jpg",
  series: "brigid",
  content: `<p>Estou voltando a um projeto que nasceu como meu <strong>TCC</strong>: o <strong>BrigidAI</strong>, uma plataforma de apoio ao diagnóstico da Doença de Parkinson a partir de imagens de ressonância magnética.</p>
<p>Só que voltar não foi continuar de onde parei. A primeira coisa que fiz foi uma <strong>autópsia da própria concepção</strong> — reler o que eu tinha proposto e perguntar, com má vontade, o que sobreviveria a uma banca hostil.</p>
<p>Ela não sobreviveu inteira. E este primeiro devlog é sobre isso, porque acho mais útil registrar o erro do que a versão limpa que veio depois.</p>
<hr>
<h3>O que o TCC prometia</h3>
<p>A concepção original descrevia uma plataforma que <strong>detectaria degeneração neuronal precoce</strong> analisando a <strong>substância nigra</strong> em ressonância magnética, usando uma ResNet50 adaptada — que eu tinha até batizado de "ParkinsonCNN" — com o stack inteiro em <strong>C#/.NET e ML.NET</strong>.</p>
<p>Soa bem. Cada pedaço tem um problema.</p>
<hr>
<h3>Três problemas, cada um fatal numa banca</h3>
<p><strong>1. A substância nigra é invisível em T1.</strong></p>
<p>Este é o mais grave, e é de física, não de código. A literatura que <em>de fato</em> detecta degeneração nigral usa <strong>NM-MRI</strong> (neuromelanina) ou <strong>SWI/QSM</strong> (nigrossomo-1, o <em>swallow tail sign</em>). Uma CNN rodando sobre <strong>T1 convencional</strong> e alegando enxergar degeneração da SN <strong>faz uma afirmação que a imagem não sustenta</strong>. Nenhuma quantidade de acurácia conserta isso: se o sinal não está no pixel, o que a rede aprendeu é outra coisa — e "outra coisa" é a primeira pergunta da banca.</p>
<p>A saída é binária: ou muda a modalidade, ou muda a alegação.</p>
<p><strong>2. "Detecção antes dos sintomas" não é o que um classificador DP × controle responde.</strong></p>
<p>Um modelo que separa pacientes com Parkinson de controles saudáveis responde <em>"esta pessoa tem DP?"</em>. Ele não responde <em>"esta pessoa vai ter"</em>. Para a pergunta pré-clínica você precisa de <strong>coorte prodrômica</strong> (RBD, hiposmia) e <strong>desfecho de conversão</strong> — quem converteu, em quanto tempo.</p>
<p>O PPMI tem essa coorte. Mas o N é pequeno e o rótulo é fraco. Cientificamente é a pergunta mais valiosa — e era a ambição original. Num trabalho com prazo, é uma aposta que pode terminar sem resultado nenhum.</p>
<p><strong>3. ML.NET não é framework de pesquisa.</strong></p>
<p>Treinar CNN 3D em ML.NET custaria meses de luta com ferramenta e não renderia crédito acadêmico nenhum. Eu tinha escolhido a stack pela minha zona de conforto e depois inventado a justificativa.</p>
<hr>
<h3>A virada: a plataforma é a contribuição</h3>
<p>O erro de fundo era o enquadramento. Eu estava tentando fazer a tese ser <em>"minha CNN acerta X%"</em> — e essa tese, além de frágil pelos motivos acima, é <strong>saturada</strong>. "Treinamos uma ResNet50 no PPMI e obtivemos 92%" já foi feito dezenas de vezes. Não é contribuição em 2026, e a banca perguntaria, com razão, "por que não PyTorch?".</p>
<p>A reformulação inverte o que é fim e o que é meio. A tese passa a ser:</p>
<p><strong>Modelos de IA médica morrem no caminho do laboratório para o hospital</strong> — e a contribuição é uma <strong>plataforma reprodutível, auditável e integrável a PACS via DICOM</strong> que fecha essa lacuna, com Parkinson como <em>estudo de caso</em>.</p>
<p>O núcleo científico dentro dela é a <strong>generalização entre centros e fabricantes de scanner</strong>: treinar num conjunto de sites, testar em outros <strong>nunca vistos</strong>, e medir o quanto o desempenho desaba — porque ele quase sempre desaba, e quase ninguém reporta. Quantificar essa queda com honestidade e propor mitigação (harmonização ComBat, <em>domain adaptation</em>) é um resultado que <strong>sobrevive à revisão</strong>, ao contrário de mais um 97% que ninguém reproduz.</p>
<p>E aqui o .NET deixa de ser desculpa e vira <strong>o ponto</strong>: hospitais rodam Windows, .NET, Delphi e PACS. O mundo da pesquisa é 100% Python. Uma plataforma de inferência <strong>.NET-nativa que pluga em PACS</strong> é exatamente a lacuna que ninguém preenche — e é onde a minha competência real (backend e infra em software médico) joga a favor, em vez de contra.</p>
<hr>
<h3>As regras que não se negociam</h3>
<p>Estas eu registrei separado, porque são fáceis de esquecer sob prazo — e cada uma, violada, invalida o trabalho inteiro:</p>
<ul>
<li><strong>Um sujeito, um volume.</strong> Vazamento por sujeito é a <strong>causa nº 1</strong> das acurácias de 97–99% na literatura de Parkinson + CNN: fatias ou visitas do mesmo paciente caindo em treino e teste, e a rede aprende a reconhecer <strong>a pessoa</strong>, não a doença. A mitigação é <em>estrutural</em>: split sempre por sujeito, e um teste no CI que <strong>falha</strong> se qualquer <code>subject_id</code> aparecer em dois splits.</li>
<li><strong>A estatística de normalização só vê o treino.</strong> Calcular média e desvio sobre o dataset inteiro antes do split faz o teste vazar pro treino de forma <strong>invisível</strong> — não dá erro, não dá aviso, só te dá um número bonito. Imposto pelo código, não por disciplina.</li>
<li><strong>AUC acima de 0,90 é bug presumido.</strong> O sinal de DP em T1 estrutural é genuinamente fraco e difuso; a literatura séria reporta <strong>0,70–0,80</strong>. Número alto demais é <strong>sintoma, não conquista</strong>: procure o vazamento antes de comemorar. Esse único hábito mental separa os trabalhos que sobrevivem à arguição dos que não.</li>
<li><strong>Nada de exclusão silenciosa.</strong> Sujeito que falha no pré-processamento e some sem registro é viés de seleção — e a banca vai procurar. Todo excluído é contabilizado <strong>com causa</strong>, e o fluxograma de exclusões (CONSORT/STARD) é <strong>gerado a partir do log</strong>, nunca escrito à mão.</li>
<li><strong>Nunca reportar acurácia crua.</strong> O PPMI tem 2–3 pacientes para cada controle: um modelo que chuta "PD" sempre acerta ~70% e parece competente. Peso de classe no treino, e reportar AUC, AUPRC e acurácia balanceada.</li>
</ul>
<p>Repare no padrão: quase todas são <strong>impostas por código</strong>, não por boa intenção. É proposital. Boa intenção não sobrevive à semana da entrega.</p>
<hr>
<h3>Onde estou agora</h3>
<p>Fase <strong>P0</strong> — ingestão e inventário. O CLI <code>brigid inventory</code> já percorre uma árvore do PPMI, fia a fonte dos dados, aplica o gate de elegibilidade de <strong>T1 3D volumétrico</strong> — que <strong>sinaliza, não descarta</strong>, justamente pra não cair na exclusão silenciosa — e emite o relatório de contagens e sinalizados por causa. Que é, por construção, a <strong>Tabela 1</strong> do trabalho.</p>
<p>Nada de modelo ainda. E é de propósito: se as fundações de dados estiverem erradas, todo número que vier depois é ficção.</p>
<p>Sobre o futuro: um <strong>mestrado é um desdobramento possível</strong>, não um fato. Por ora, o que está em jogo é retomar direito o que o TCC deixou pela metade — e desta vez com as três regras coladas na parede.</p>`,
}
