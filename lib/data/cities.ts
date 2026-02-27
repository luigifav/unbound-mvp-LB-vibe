// Lista de cidades por UF — usada no formulário de cadastro
// Extraída para arquivo separado para reduzir o bundle da página de registro

export const CITIES_BY_UF: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasileia", "Epitaciolândia", "Xapuri", "Plácido de Castro", "Porto Walter"],
  AL: ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "São Miguel dos Campos", "Delmiro Gouveia", "Marechal Deodoro", "Coruripe"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Tartarugalzinho", "Pedra Branca do Amapari", "Calçoene", "Vitória do Jari"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Gabriel da Cachoeira", "Humaitá", "Borba", "Manicoré"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Petrolina", "Itabuna", "Ilhéus", "Lauro de Freitas", "Jequié", "Teixeira de Freitas", "Barreiras", "Porto Seguro", "Simões Filho", "Paulo Afonso"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Canindé", "Aquiraz", "Pacatuba"],
  DF: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Planaltina", "Gama", "Recanto das Emas", "Sobradinho", "Santa Maria", "São Sebastião"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Cachoeiro de Itapemirim", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Viana", "Nova Venécia"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Itumbiara", "Senador Canedo"],
  MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Barra do Corda", "Pedreiras"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana", "Sidrolândia", "Paranaíba", "Maracaju"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas", "Pouso Alegre", "Teófilo Otoni", "Barbacena", "Sabará", "Vespasiano"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Altamira", "Itaituba", "Redenção", "Tucuruí", "Marituba", "Abaetetuba", "Cametá", "Bragança", "Barcarena"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Sapé", "Queimadas"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo", "Almirante Tamandaré", "Umuarama", "Piraquara", "Cambé", "Fazenda Rio Grande"],
  PE: ["Recife", "Caruaru", "Olinda", "Petrolina", "Jaboatão dos Guararapes", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "Abreu e Lima", "Santa Cruz do Capibaribe", "Salgueiro", "Araripina"],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "Oeiras", "Esperantina", "Pedro II"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda", "Magé", "Itaboraí", "Macaé", "Cabo Frio", "Nova Friburgo", "Angra dos Reis", "Nilópolis", "Resende", "Teresópolis", "Mesquita"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "Santa Cruz"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Santa Cruz do Sul", "Cachoeirinha", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba", "Cachoeira do Sul", "Lajeado"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Ouro Preto do Oeste", "Buritis"],
  RR: ["Boa Vista", "Caracaraí", "Rorainópolis", "Alto Alegre", "Mucajaí", "Cantá", "Bonfim", "Pacaraima", "Normandia", "Amajari"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí", "Criciúma", "Jaraguá do Sul", "Lages", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão", "São Bento do Sul", "Caçador", "Concórdia", "Camboriú", "Navegantes", "Indaial", "Gaspar"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José do Rio Preto", "Santos", "Mogi das Cruzes", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "São Vicente", "Franca", "Guarujá", "Taubaté", "Praia Grande", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "São Carlos", "Indaiatuba", "Araraquara", "Americana", "Presidente Prudente", "Rio Claro", "Marília", "Araçatuba", "Hortolândia"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Simão Dias", "Propriá", "Neópolis"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"],
};

export const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
