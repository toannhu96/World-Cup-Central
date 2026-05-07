export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ── 2026 WORLD CUP FACTS ──────────────────────────────────────────
  {
    question: "How many teams are competing in the 2026 World Cup?",
    options: ["32", "40", "48", "64"],
    correctIndex: 2,
    funFact: "2026 is the first World Cup with 48 teams — a 50% jump from the 32-team format used since 1998!",
  },
  {
    question: "Which stadium hosts the 2026 World Cup Final?",
    options: ["Rose Bowl", "MetLife Stadium", "AT&T Stadium", "SoFi Stadium"],
    correctIndex: 1,
    funFact: "MetLife Stadium in East Rutherford, New Jersey holds over 82,500 fans. It's the largest stadium in the US!",
  },
  {
    question: "How many total matches are played in the 2026 World Cup?",
    options: ["64", "80", "96", "104"],
    correctIndex: 3,
    funFact: "104 matches across 39 days. That's 40 more than the 64-match format used from 1998–2022!",
  },
  {
    question: "How many groups are there in the 2026 World Cup?",
    options: ["8", "10", "12", "16"],
    correctIndex: 2,
    funFact: "12 groups of 4 teams each. The best 8 third-place finishers also advance — mediocrity might be enough!",
  },
  {
    question: "How many host countries does the 2026 World Cup span?",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    funFact: "USA, Canada, and Mexico co-host — the first time three countries have ever shared hosting duties!",
  },
  {
    question: "How many venues are in the 2026 World Cup?",
    options: ["12", "14", "16", "18"],
    correctIndex: 2,
    funFact: "16 stadiums across 3 countries. The USA hosts 11, Mexico 3, and Canada 2.",
  },
  {
    question: "Which Canadian cities are hosting 2026 World Cup matches?",
    options: ["Toronto & Montreal", "Toronto & Vancouver", "Vancouver & Calgary", "Montreal & Ottawa"],
    correctIndex: 1,
    funFact: "Toronto's BMO Field and Vancouver's BC Place host matches. Canada's first-ever World Cup hosting!",
  },
  {
    question: "What is the first knockout round called in the 2026 World Cup?",
    options: ["Round of 24", "Round of 32", "Round of 48", "Round of 16"],
    correctIndex: 1,
    funFact: "The Round of 32 is new to 2026 — previously tournaments went straight to Round of 16 with 32 teams.",
  },
  {
    question: "How many teams advance directly from each group to the knockout stage?",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
    funFact: "Top 2 from each group advance automatically. Then the 8 best 3rd-place teams also advance — so 32 teams reach R32!",
  },
  {
    question: "What dates does the 2026 World Cup run?",
    options: ["May 28 – July 11", "June 11 – July 19", "June 15 – July 22", "June 1 – July 15"],
    correctIndex: 1,
    funFact: "June 11 to July 19, 2026 — 39 days of non-stop football across North America!",
  },
  {
    question: "Which US city hosts the most 2026 World Cup matches?",
    options: ["New York", "Dallas", "Los Angeles", "Miami"],
    correctIndex: 2,
    funFact: "Los Angeles (SoFi Stadium) and Dallas (AT&T Stadium) both host the most matches — the Final goes to MetLife in NJ.",
  },
  {
    question: "Which Mexican city hosts 2026 World Cup matches?",
    options: ["Cancún only", "Mexico City, Guadalajara & Monterrey", "Mexico City only", "Acapulco & Tijuana"],
    correctIndex: 1,
    funFact: "Mexico City's Azteca Stadium is legendary — it hosted the 1970 and 1986 WC Finals. Historic venue returning!",
  },

  // ── WORLD CUP WINNERS ─────────────────────────────────────────────
  {
    question: "Who won the 2022 World Cup?",
    options: ["France", "Brazil", "Argentina", "Croatia"],
    correctIndex: 2,
    funFact: "Argentina beat France in the most dramatic Final ever — 3-3 after extra time, then won 4-2 on penalties!",
  },
  {
    question: "Who won the 2018 World Cup?",
    options: ["Croatia", "Belgium", "France", "England"],
    correctIndex: 2,
    funFact: "France beat Croatia 4-2 in Moscow. Mbappé became the first teenager to score in a WC Final since Pelé in 1958!",
  },
  {
    question: "Who won the 2014 World Cup?",
    options: ["Brazil", "Argentina", "Germany", "Netherlands"],
    correctIndex: 2,
    funFact: "Germany beat Argentina 1-0 in extra time. Mario Götze scored the winner, making Germany the first European team to win in South America!",
  },
  {
    question: "Who won the 2010 World Cup?",
    options: ["Brazil", "Netherlands", "Spain", "Germany"],
    correctIndex: 2,
    funFact: "Spain's first-ever World Cup win! Andrés Iniesta scored the winner in the 116th minute vs Netherlands. ¡Campeones!",
  },
  {
    question: "Who won the 2006 World Cup?",
    options: ["France", "Germany", "Portugal", "Italy"],
    correctIndex: 3,
    funFact: "Italy beat France on penalties. It's also the tournament where Zidane headbutted Materazzi in his final career match!",
  },
  {
    question: "Who won the 2002 World Cup?",
    options: ["Germany", "Brazil", "Turkey", "Senegal"],
    correctIndex: 1,
    funFact: "Brazil's 5th and most recent title! Ronaldo (the original Ronaldo) scored twice in the Final against Germany.",
  },
  {
    question: "Who won the 1998 World Cup?",
    options: ["Brazil", "France", "Italy", "Netherlands"],
    correctIndex: 1,
    funFact: "France won at home! Zidane scored twice with headers in the Final. They beat Brazil 3-0 at the Stade de France.",
  },
  {
    question: "Which country has won the most World Cups?",
    options: ["Germany", "Italy", "Argentina", "Brazil"],
    correctIndex: 3,
    funFact: "Brazil has 5 titles: 1958, 1962, 1970, 1994, and 2002. They're the only nation to appear in every tournament!",
  },
  {
    question: "Who won the very first World Cup in 1930?",
    options: ["Brazil", "Argentina", "Uruguay", "Italy"],
    correctIndex: 2,
    funFact: "Uruguay won at home! Only 13 countries participated — most traveled by boat to get to Montevideo.",
  },
  {
    question: "How many times has Germany won the World Cup?",
    options: ["3", "4", "5", "2"],
    correctIndex: 1,
    funFact: "Germany (+ West Germany) won in 1954, 1974, 1990, and 2014. They've also lost 4 Finals — heartbreak champions!",
  },
  {
    question: "How many times has Italy won the World Cup?",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
    funFact: "Italy won in 1934, 1938, 1982, and 2006. But they didn't qualify for 2018 OR 2022. From champions to spectators!",
  },
  {
    question: "How many times has Argentina won the World Cup?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    funFact: "Argentina won in 1978, 1986 (Maradona's tournament), and 2022 (Messi's tournament). A 36-year wait between 2nd and 3rd!",
  },
  {
    question: "Which country won the 1966 World Cup on home soil?",
    options: ["West Germany", "Portugal", "England", "Soviet Union"],
    correctIndex: 2,
    funFact: "England's only World Cup win! Geoff Hurst scored a hat-trick in the Final vs West Germany. Still their only star.",
  },

  // ── RECORDS & LEGENDS ─────────────────────────────────────────────
  {
    question: "Who holds the record for most career World Cup goals?",
    options: ["Ronaldo", "Miroslav Klose", "Pelé", "Just Fontaine"],
    correctIndex: 1,
    funFact: "Miroslav Klose scored 16 goals across 4 tournaments (2002–2014). He broke Ronaldo's record of 15 in the 2014 semifinal!",
  },
  {
    question: "Who scored the most goals in a single World Cup tournament?",
    options: ["Ronaldo (2002)", "Miroslav Klose (2006)", "Just Fontaine (1958)", "Sándor Kocsis (1954)"],
    correctIndex: 2,
    funFact: "Just Fontaine (France) scored 13 goals in 1958. A record standing for 68+ years that may never be broken!",
  },
  {
    question: "Who scored the fastest goal in World Cup history?",
    options: ["Klose (2002)", "Hakan Şükür (2002)", "Ronaldo (1998)", "Inzaghi (2006)"],
    correctIndex: 1,
    funFact: "Hakan Şükür (Turkey) scored after just 10.8 seconds vs South Korea in 2002. Blink and you'd miss it!",
  },
  {
    question: "Who holds the record for most World Cup appearances (matches played)?",
    options: ["Paolo Maldini", "Lothar Matthäus", "Cafu", "Ronaldo"],
    correctIndex: 1,
    funFact: "Lothar Matthäus played in 25 World Cup matches across 5 tournaments (1982–1998). A man who refused to retire!",
  },
  {
    question: "Who is the youngest player to score in a World Cup?",
    options: ["Mbappé", "Pelé", "Michael Owen", "Theo Walcott"],
    correctIndex: 1,
    funFact: "Pelé was just 17 years and 239 days old when he scored in 1958. He also scored in the Final that year!",
  },
  {
    question: "What is the biggest winning margin in a World Cup match?",
    options: ["8 goals", "9 goals", "10 goals", "11 goals"],
    correctIndex: 1,
    funFact: "Hungary beat El Salvador 10–1 in 1982. The goalkeeper, Luis Guevara Mora, had a very long flight home.",
  },
  {
    question: "Who scored 5 goals in a single World Cup match in 1994?",
    options: ["Romário", "Oleg Salenko", "Hristo Stoichkov", "Roberto Baggio"],
    correctIndex: 1,
    funFact: "Oleg Salenko (Russia) scored 5 vs Cameroon in 1994 — then scored no more goals in the tournament. One iconic day!",
  },
  {
    question: "Who scored the Golden Boot at the 2022 World Cup?",
    options: ["Messi", "Mbappé", "Giroud", "Benzema"],
    correctIndex: 1,
    funFact: "Mbappé scored 8 goals, including a hat-trick in the Final. He's the only person who made losing feel like winning.",
  },
  {
    question: "Who won the Golden Ball (best player) at the 2022 World Cup?",
    options: ["Mbappé", "Modric", "Messi", "De Bruyne"],
    correctIndex: 2,
    funFact: "Messi finally won the World Cup AND the Golden Ball in 2022, ending the 'Is he better than Maradona?' debate. (Mostly.)",
  },
  {
    question: "Who is Argentina's all-time top scorer?",
    options: ["Maradona", "Batistuta", "Tevez", "Messi"],
    correctIndex: 3,
    funFact: "Messi surpassed Batistuta's record of 54 goals. He's also the player with the most WC appearances ever (26 matches)!",
  },
  {
    question: "Which player scored a hat-trick in the 2022 World Cup Final?",
    options: ["Messi", "Griezmann", "Giroud", "Mbappé"],
    correctIndex: 3,
    funFact: "Mbappé's Final hat-trick is only the second in WC Final history — the first was Geoff Hurst for England in 1966!",
  },
  {
    question: "Who scored the 'Hand of God' goal in 1986?",
    options: ["Pelé", "Zidane", "Maradona", "Ronaldo"],
    correctIndex: 2,
    funFact: "Maradona punched the ball in with his left hand against England, then called it 'the hand of God.' Brilliant cheek!",
  },
  {
    question: "What is Zidane famous for in the 2006 World Cup Final?",
    options: ["Scoring a hat-trick", "Missing a penalty", "Headbutting Materazzi", "Being sent off for diving"],
    correctIndex: 2,
    funFact: "Zidane headbutted Materazzi in the chest in the 110th minute of his final career game. One of football's great mysteries!",
  },
  {
    question: "Who missed the crucial penalty in the 1994 World Cup Final?",
    options: ["Romário", "Roberto Baggio", "Bebeto", "Franco Baresi"],
    correctIndex: 1,
    funFact: "Roberto Baggio's missed penalty gave Brazil the title. He later said it was 'the most painful moment of my life.'",
  },

  // ── HISTORY & MOMENTS ─────────────────────────────────────────────
  {
    question: "Which team pulled off the biggest upset of WC 2022, beating Argentina?",
    options: ["Poland", "Australia", "Saudi Arabia", "Mexico"],
    correctIndex: 2,
    funFact: "Saudi Arabia beat Argentina 2-1 despite Messi opening the scoring! The next day was declared a national holiday in KSA.",
  },
  {
    question: "Which African team reached the World Cup semi-finals for the first time in 2022?",
    options: ["Nigeria", "Senegal", "Ghana", "Morocco"],
    correctIndex: 3,
    funFact: "Morocco eliminated Belgium, Spain, and Portugal before losing to France in the semis. The whole continent celebrated!",
  },
  {
    question: "Which team knocked Brazil out of the 2022 Quarter-Finals?",
    options: ["Argentina", "Croatia", "France", "Morocco"],
    correctIndex: 1,
    funFact: "Croatia beat Brazil on penalties. Rodrygo and Marquinhos missed — Brazil fans still haven't recovered.",
  },
  {
    question: "Which country hosted the 2014 World Cup?",
    options: ["Argentina", "Brazil", "USA", "Colombia"],
    correctIndex: 1,
    funFact: "Brazil hosted — and lost 7-1 to Germany in the semi-final. That match is called 'O Mineirazo' in Brazil. Haunting.",
  },
  {
    question: "What was the score when Germany beat Brazil in the 2014 semi-final?",
    options: ["5-0", "6-0", "7-1", "7-0"],
    correctIndex: 2,
    funFact: "Germany scored 5 goals in 18 incredible first-half minutes. Brazil fans openly wept in the Mineirão stadium.",
  },
  {
    question: "Which country hosted the 2018 World Cup?",
    options: ["Qatar", "Germany", "Russia", "South Africa"],
    correctIndex: 2,
    funFact: "Russia 2018 was the easternmost WC ever. Yekaterinburg's stadium was so small they built temporary stands OUTSIDE!",
  },
  {
    question: "Which country hosted the 2022 World Cup?",
    options: ["Saudi Arabia", "UAE", "Qatar", "Bahrain"],
    correctIndex: 2,
    funFact: "Qatar was the first Middle Eastern host. To beat the summer heat, the tournament was moved to November–December!",
  },
  {
    question: "Which iconic match in 1970 is called 'The Match of the Century'?",
    options: ["Brazil vs Uruguay", "Italy vs West Germany", "Brazil vs England", "Netherlands vs West Germany"],
    correctIndex: 1,
    funFact: "Italy beat West Germany 4-3 in extra time in the 1970 semi-final. Four goals in the last 19 minutes of extra time!",
  },
  {
    question: "What year did the USA co-host the World Cup for the first time?",
    options: ["1990", "1992", "1994", "1998"],
    correctIndex: 2,
    funFact: "USA 1994 set World Cup attendance records that still stand today! Americans went wild for a sport they barely knew.",
  },
  {
    question: "Which year did South Korea stun the world by reaching the World Cup semi-finals?",
    options: ["1998", "2002", "2006", "2010"],
    correctIndex: 1,
    funFact: "South Korea co-hosted 2002 with Japan and reached the semi-finals, beating Spain and Italy along the way!",
  },
  {
    question: "Which African team was the first to reach the World Cup Quarter-Finals?",
    options: ["Nigeria", "Senegal", "Cameroon", "South Africa"],
    correctIndex: 2,
    funFact: "Cameroon reached the QF in 1990 with Roger Milla (38 years old!) scoring. Their celebration dance became iconic!",
  },
  {
    question: "Who was the oldest player ever to appear at a World Cup?",
    options: ["Dino Zoff", "Faryd Mondragón", "Roger Milla", "Peter Shilton"],
    correctIndex: 1,
    funFact: "Faryd Mondragón (Colombia) played at age 43 years and 3 days in 2014. He came on in the 87th minute just to set the record!",
  },
  {
    question: "How many players were in the 1930 World Cup?",
    options: ["13 teams", "16 teams", "24 teams", "32 teams"],
    correctIndex: 0,
    funFact: "Only 13 teams participated in 1930. Many European countries didn't attend because the boat journey was too long!",
  },
  {
    question: "What year did the World Cup expand from 24 to 32 teams?",
    options: ["1994", "1998", "2002", "2006"],
    correctIndex: 1,
    funFact: "France 1998 was the first 32-team WC. Now 2026 jumps to 48 — at this rate, everyone qualifies by 2050!",
  },
  {
    question: "The 'Miracle of Bern' refers to which World Cup Final?",
    options: ["1950 — Uruguay beats Brazil", "1954 — West Germany beats Hungary", "1966 — England beats W Germany", "1974 — W Germany beats Netherlands"],
    correctIndex: 1,
    funFact: "West Germany came from 2-0 down to beat Hungary 3-2 in 1954. Hungary was considered unbeatable — they'd scored 27 goals in the tournament!",
  },

  // ── RULES & FORMAT ────────────────────────────────────────────────
  {
    question: "How many substitutions are allowed per team in a World Cup match?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    funFact: "5 substitutions became permanent in 2022 after COVID-era experiments showed they improved match quality.",
  },
  {
    question: "How long is extra time in a knockout World Cup match?",
    options: ["20 minutes", "30 minutes", "40 minutes", "45 minutes"],
    correctIndex: 1,
    funFact: "Two 15-minute periods. If still tied, penalties decide. Football's version of Russian roulette!",
  },
  {
    question: "What does VAR stand for in football?",
    options: ["Video Assistant Referee", "Visual Assistance Review", "Video Action Review", "Verified Arbitration Ruling"],
    correctIndex: 0,
    funFact: "VAR was introduced at WC 2018. It's added an average of 6 extra minutes per match — fans have very mixed feelings!",
  },
  {
    question: "What year was VAR first used at a World Cup?",
    options: ["2014", "2018", "2022", "2010"],
    correctIndex: 1,
    funFact: "Russia 2018 was the first WC with VAR. France benefited from it in the Final — a Griezmann penalty was awarded via review!",
  },
  {
    question: "How many players does each team have registered on their 2026 World Cup squad?",
    options: ["23", "25", "26", "28"],
    correctIndex: 2,
    funFact: "Since 2022, squads expanded from 23 to 26 players — three extra just in case your striker gets food poisoning!",
  },
  {
    question: "In a penalty shootout, how many penalties does each team take first?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    funFact: "Each team takes 5 penalties alternately. If still tied after 5 each, it goes to sudden death — one miss and you're out!",
  },
  {
    question: "How far is the penalty spot from the goal?",
    options: ["10 yards", "11 yards", "12 yards", "16 yards"],
    correctIndex: 2,
    funFact: "The penalty spot is exactly 12 yards (11 metres) from the goal line. Goalkeepers save about 25% of WC penalties!",
  },
  {
    question: "What colour card does a referee show to permanently dismiss a player?",
    options: ["Yellow", "Orange", "Red", "Black"],
    correctIndex: 2,
    funFact: "Red cards were invented for the 1970 WC — before that, referees had to mime being sent off. Much less dramatic!",
  },

  // ── TEAMS & NICKNAMES ─────────────────────────────────────────────
  {
    question: "Which country's national football team is nicknamed 'Les Bleus'?",
    options: ["Belgium", "Italy", "France", "Brazil"],
    correctIndex: 2,
    funFact: "Les Bleus (The Blues) refers to France's traditional blue home kit. They've worn it since their first international in 1904!",
  },
  {
    question: "Which team is nicknamed 'Die Mannschaft' (The Team)?",
    options: ["Austria", "Switzerland", "Germany", "Netherlands"],
    correctIndex: 2,
    funFact: "'Die Mannschaft' was actually Germany's official nickname — but they retired it in 2019 saying it was 'too arrogant'!",
  },
  {
    question: "Which team is nicknamed 'The Socceroos'?",
    options: ["New Zealand", "South Africa", "Australia", "Fiji"],
    correctIndex: 2,
    funFact: "The Australian Socceroos qualified for 2026! Their nickname blends 'soccer' and 'kangaroo'. Perfectly Australian.",
  },
  {
    question: "What is Brazil's football style called?",
    options: ["Tiki-taka", "Total Football", "Jogo Bonito", "Catenaccio"],
    correctIndex: 2,
    funFact: "Jogo Bonito means 'the beautiful game'. Brazil's 1970 team is still widely considered the greatest football team ever assembled!",
  },
  {
    question: "Which Spanish football style emphasizes short passing and possession?",
    options: ["Gegenpressing", "Tiki-taka", "Catenaccio", "Route One"],
    correctIndex: 1,
    funFact: "Spain's tiki-taka dominated 2008–2012, winning Euro 2008, WC 2010, and Euro 2012. Then everyone figured out how to counter it!",
  },
  {
    question: "What nationality is Cristiano Ronaldo?",
    options: ["Spanish", "Brazilian", "Portuguese", "Argentine"],
    correctIndex: 2,
    funFact: "Ronaldo is from the island of Madeira, Portugal. He became the first player to score at 5 different World Cups in 2022!",
  },
  {
    question: "What nationality is Lionel Messi?",
    options: ["Spanish", "Brazilian", "Uruguayan", "Argentine"],
    correctIndex: 3,
    funFact: "Born in Rosario, Argentina. Despite growing up in Spain (Barcelona), Messi always chose Argentina. Worth the wait — 2022!",
  },
  {
    question: "Which country's team is nicknamed 'The Three Lions'?",
    options: ["Scotland", "Wales", "England", "Ireland"],
    correctIndex: 2,
    funFact: "England's badge has three lions — dating back to King Richard I in the 12th century. Still waiting for their second star!",
  },
  {
    question: "Which European country is nicknamed 'The Oranje'?",
    options: ["Belgium", "Denmark", "Netherlands", "Austria"],
    correctIndex: 2,
    funFact: "The Dutch wear bright orange — the colour of the House of Orange-Nassau royal family. They've lost 3 World Cup Finals!",
  },
  {
    question: "Which South American team is nicknamed 'La Albiceleste' (The White and Sky Blue)?",
    options: ["Uruguay", "Chile", "Colombia", "Argentina"],
    correctIndex: 3,
    funFact: "Argentina's iconic blue-and-white stripes date back to 1884. Messi wore those stripes to glory in 2022!",
  },
  {
    question: "Which country has never won a World Cup despite reaching 3 Finals?",
    options: ["Croatia", "Netherlands", "Portugal", "Belgium"],
    correctIndex: 1,
    funFact: "Netherlands lost the 1974, 1978, and 2010 Finals — the unluckiest team in World Cup history!",
  },

  // ── STADIUMS & VENUES ─────────────────────────────────────────────
  {
    question: "What is the name of Mexico City's iconic stadium?",
    options: ["Estadio Azteca", "Estadio Jalisco", "Estadio BBVA", "Estadio Chivas"],
    correctIndex: 0,
    funFact: "Estadio Azteca hosted the 1970 AND 1986 WC Finals — the only stadium to host two finals. Now returning for 2026!",
  },
  {
    question: "Which stadium hosted the 2014 World Cup Final?",
    options: ["Maracanã", "Estádio do Castelão", "Estádio das Dunas", "Arena Corinthians"],
    correctIndex: 0,
    funFact: "The Maracanã in Rio de Janeiro — one of football's most iconic venues. Originally built for the 1950 WC!",
  },
  {
    question: "Which stadium hosted the 2018 World Cup Final in Moscow?",
    options: ["Spartak Stadium", "Luzhniki Stadium", "Otkrytiye Arena", "CSKA Arena"],
    correctIndex: 1,
    funFact: "Luzhniki Stadium holds 81,000 fans. France beat Croatia 4-2 here in a chaotic, brilliant Final!",
  },
  {
    question: "Where was the 2010 World Cup Final held?",
    options: ["Cape Town", "Soweto", "Johannesburg", "Durban"],
    correctIndex: 2,
    funFact: "Soccer City (now FNB Stadium) in Johannesburg held 94,000 fans as Iniesta won it for Spain in extra time!",
  },

  // ── FUN & QUIRKY FACTS ────────────────────────────────────────────
  {
    question: "What controversial instrument was heard throughout the 2010 World Cup?",
    options: ["Air horn", "Vuvuzela", "Didgeridoo", "Kazoo"],
    correctIndex: 1,
    funFact: "The vuvuzela — a South African plastic horn — created a constant buzzing sound. Some loved it, many TV viewers wanted to mute!",
  },
  {
    question: "Which animal famously predicted WC 2010 match winners?",
    options: ["Paul the Octopus", "Mani the Parakeet", "Flopsy the Rabbit", "Otto the Elephant"],
    correctIndex: 0,
    funFact: "Paul the Octopus from Germany went 8/8 correct in 2010, including Spain winning the Final. Science still baffled!",
  },
  {
    question: "What did Qatar build to keep fans cool at the 2022 World Cup?",
    options: ["Underground fans", "Massive water walls", "Air-conditioned stadiums", "Ice rinks"],
    correctIndex: 2,
    funFact: "Qatar spent billions on air-conditioned stadiums to make the November tournament comfortable. They opened vent systems on the pitch!",
  },
  {
    question: "In what year was the offside rule introduced to World Cup play?",
    options: ["1930 — at the very first WC", "1954 — after complaints", "1970 — with the new rules", "1982 — to stop gamesmanship"],
    correctIndex: 0,
    funFact: "Offside existed from the very first WC in 1930 — it was always part of football's laws. VAR just made it more precise (and controversial)!",
  },
  {
    question: "What is a 'brace' in football?",
    options: ["An injury bandage", "Two goals by one player", "Three goals by one player", "A defensive formation"],
    correctIndex: 1,
    funFact: "Scoring two goals is called a brace. Three goals is a hat-trick, four is a 'haul', and five is a 'glut'. Oleg Salenko got a glut in 1994!",
  },
  {
    question: "What is a 'clean sheet' in football?",
    options: ["A contract bonus", "When a team doesn't concede any goals", "A yellow card warning", "When both teams score"],
    correctIndex: 1,
    funFact: "Goalkeepers love clean sheets! In 2022, Morocco's goalkeeper Yassine Bounou kept 3 clean sheets in a row in the knockout stage.",
  },
  {
    question: "What does 'FIFA' stand for?",
    options: ["Football International Federation Association", "Fédération Internationale de Football Association", "Football Institute For Athletes", "Federal International Football Agency"],
    correctIndex: 1,
    funFact: "FIFA was founded in Paris in 1904 with just 7 member nations. Today it has 211 — more members than the United Nations!",
  },
  {
    question: "The Jules Rimet Trophy (original WC trophy) was stolen in which country?",
    options: ["Brazil", "Mexico", "England", "Germany"],
    correctIndex: 2,
    funFact: "The trophy was stolen in London before the 1966 WC. A dog named Pickles found it wrapped in newspaper under a hedge a week later!",
  },
  {
    question: "Which country's fans are famous for their incredible carnival-style support called 'Torcida'?",
    options: ["Argentina", "Brazil", "Colombia", "Mexico"],
    correctIndex: 1,
    funFact: "Brazil's supporters — the Torcida — travel in massive groups wearing yellow and green. Their drums and samba never stop!",
  },
  {
    question: "Which player invented the famous 'Cruyff Turn' used at the 1974 World Cup?",
    options: ["Pelé", "Johan Cruyff", "Franz Beckenbauer", "Günter Netzer"],
    correctIndex: 1,
    funFact: "Johan Cruyff used his famous turn against Sweden in 1974 and it became one of football's most copied moves ever!",
  },
  {
    question: "What were 'Total Football' pioneers at the 1974 World Cup?",
    options: ["Brazil", "West Germany", "Netherlands", "East Germany"],
    correctIndex: 2,
    funFact: "Netherlands' 'Total Football' saw every outfield player able to play in any position. They lost the Final to West Germany but changed football forever!",
  },
  {
    question: "Which goalkeeper is famous for saving 5 penalties in a single WC tournament?",
    options: ["Peter Schmeichel", "Gianluigi Buffon", "Ricardo (Portugal)", "David de Gea"],
    correctIndex: 2,
    funFact: "Ricardo saved 5 penalties at the 2006 WC including saving one and then scoring the winning penalty himself vs England!",
  },
  {
    question: "In 1982, which team scored 12 goals in a single group stage match?",
    options: ["Brazil vs Bolivia", "West Germany vs Mexico", "Hungary vs El Salvador", "France vs Kuwait"],
    correctIndex: 2,
    funFact: "Hungary beat El Salvador 10–1. Lázár Szentes scored a hat-trick and Hungary scored 5 goals in 12 second-half minutes!",
  },
  {
    question: "How many countries have won the World Cup?",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
    funFact: "Only 8 nations have ever won: Brazil (5), Germany (4), Italy (4), Argentina (3), France (2), Uruguay (2), England (1), Spain (1).",
  },
  {
    question: "Who is the only player to score in every group stage match of a World Cup as the tournament's top scorer?",
    options: ["Mbappé 2022", "Klose 2006", "Davor Šuker 1998", "Eusébio 1966"],
    correctIndex: 3,
    funFact: "Eusébio scored 9 goals for Portugal in 1966, including 4 in one match vs North Korea. Portugal finished 3rd — their best ever!",
  },
  {
    question: "What is the World Cup trophy made from?",
    options: ["Pure gold", "Gold-plated sterling silver with malachite base", "Platinum with gold plating", "Silver with gold exterior"],
    correctIndex: 1,
    funFact: "The current trophy (designed 1974) is 36cm tall and weighs 6.1kg. The original Jules Rimet trophy was given to Brazil permanently in 1970!",
  },
  {
    question: "Which WC host nation has NEVER won the World Cup?",
    options: ["Brazil (1950)", "Germany (1974)", "England (1966)", "Mexico (1970 & 1986)"],
    correctIndex: 3,
    funFact: "Mexico hosted in 1970 and 1986 but never advanced past the Quarter-Finals as hosts. They co-host 2026 — third time lucky?",
  },
];

// ── Seeded Fisher-Yates shuffle ───────────────────────────────────────
// Uses a simple LCG (linear congruential generator) — universally supported.
// Fixed seed ensures every user sees the same shuffled order.
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed >>> 0;
  const next = () => {
    // LCG constants from Numerical Recipes
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s / 0x100000000;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Pre-computed shuffled order — same for every user, stable across app reloads
export const SHUFFLED_QUESTIONS = seededShuffle(TRIVIA_QUESTIONS, 20260611);

export function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns 0-based index into SHUFFLED_QUESTIONS for today
export function getTodayQuestionIndex(): number {
  const start = new Date("2026-06-11T00:00:00Z");
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const safeDay = Math.max(0, diffDays);
  return safeDay % SHUFFLED_QUESTIONS.length;
}

export function getTodayQuestion(): TriviaQuestion {
  return SHUFFLED_QUESTIONS[getTodayQuestionIndex()];
}
