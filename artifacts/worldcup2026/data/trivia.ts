export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "How many teams are competing in the 2026 World Cup?",
    options: ["32", "40", "48", "64"],
    correctIndex: 2,
    funFact: "2026 is the first World Cup with 48 teams — a 50% increase from 32 since 1998!",
  },
  {
    question: "Which stadium hosts the 2026 World Cup Final?",
    options: ["Rose Bowl", "MetLife Stadium", "AT&T Stadium", "SoFi Stadium"],
    correctIndex: 1,
    funFact: "MetLife Stadium in New Jersey holds over 82,000 fans — and it has no roof, so pray for good weather!",
  },
  {
    question: "Who won the 2022 World Cup?",
    options: ["France", "Brazil", "Argentina", "Croatia"],
    correctIndex: 2,
    funFact: "Argentina beat France in the most dramatic Final in history — 3-3 after extra time, then penalties!",
  },
  {
    question: "Which country has won the most World Cups?",
    options: ["Germany", "Italy", "Argentina", "Brazil"],
    correctIndex: 3,
    funFact: "Brazil has 5 trophies (1958, 1962, 1970, 1994, 2002). They literally invented wearing yellow with confidence.",
  },
  {
    question: "Who holds the record for most goals scored in World Cup history?",
    options: ["Ronaldo", "Miroslav Klose", "Pele", "Just Fontaine"],
    correctIndex: 1,
    funFact: "Miroslav Klose scored 16 World Cup goals across 4 tournaments (2002–2014). An absolute machine!",
  },
  {
    question: "Who scored the infamous 'Hand of God' goal in 1986?",
    options: ["Pelé", "Zidane", "Maradona", "Ronaldo"],
    correctIndex: 2,
    funFact: "Maradona punched the ball in with his left hand but told the world it was 'the hand of God.' The ref bought it!",
  },
  {
    question: "Which team knocked Brazil out of the 2022 World Cup?",
    options: ["Argentina", "Croatia", "France", "Morocco"],
    correctIndex: 1,
    funFact: "Croatia beat Brazil on penalties in the QF. Rodrygo and Marquinhos missed — Brazil fans still haven't recovered.",
  },
  {
    question: "How many total matches are played in the 2026 World Cup?",
    options: ["64", "80", "96", "104"],
    correctIndex: 3,
    funFact: "104 matches! If you watched every second, that's roughly 158 hours of football. No bathroom breaks.",
  },
  {
    question: "Who won the very first World Cup in 1930?",
    options: ["Brazil", "Argentina", "Uruguay", "Italy"],
    correctIndex: 2,
    funFact: "Uruguay won at home in Montevideo. Only 13 countries participated — no flights, most teams traveled by boat.",
  },
  {
    question: "Who scored the fastest goal in World Cup history?",
    options: ["Miroslav Klose", "Hakan Şükür", "Ronaldo", "Inzaghi"],
    correctIndex: 1,
    funFact: "Hakan Şükür (Turkey) scored just 10.8 seconds into the 3rd-place match vs South Korea in 2002. Blink and you miss it!",
  },
  {
    question: "Who won the Golden Boot (top scorer) at the 2022 World Cup?",
    options: ["Messi", "Mbappé", "Giroud", "Benzema"],
    correctIndex: 1,
    funFact: "Mbappé scored 8 goals, including a hat-trick in the Final. He's the only person who made losing feel like winning.",
  },
  {
    question: "How many groups are there in the 2026 World Cup?",
    options: ["8", "10", "12", "16"],
    correctIndex: 2,
    funFact: "12 groups of 4 teams each. The best 8 third-place finishers also advance — so even mediocre can be enough!",
  },
  {
    question: "Which African country reached the semi-finals for the first time at WC 2022?",
    options: ["Nigeria", "Senegal", "Ghana", "Morocco"],
    correctIndex: 3,
    funFact: "Morocco eliminated Belgium, Spain, and Portugal before bowing out to France. The whole continent was watching!",
  },
  {
    question: "What is the biggest winning margin in a World Cup match?",
    options: ["Hungary 7–0 El Salvador", "Hungary 10–1 El Salvador", "Germany 8–0 Saudi Arabia", "Brazil 9–0 Bolivia"],
    correctIndex: 1,
    funFact: "Hungary beat El Salvador 10–1 in 1982. El Salvador's goalkeeper Mora must have had a very long flight home.",
  },
  {
    question: "Who scored the most goals in a single World Cup tournament?",
    options: ["Ronaldo (2002)", "Klose (2006)", "Just Fontaine (1958)", "Sándor Kocsis (1954)"],
    correctIndex: 2,
    funFact: "Just Fontaine scored 13 goals in 1958 for France. A record that has stood for 68 years and counting!",
  },
  {
    question: "How many times has Germany won the World Cup?",
    options: ["3", "4", "5", "2"],
    correctIndex: 1,
    funFact: "Germany (+ West Germany) won in 1954, 1974, 1990, and 2014. They also lost 4 finals — truly committed!",
  },
  {
    question: "What year did the World Cup expand from 24 to 32 teams?",
    options: ["1994", "1998", "2002", "2006"],
    correctIndex: 1,
    funFact: "France 1998 was the first 32-team World Cup. Now 2026 jumps to 48 — at this rate, everyone will qualify by 2050.",
  },
  {
    question: "Which country's team is nicknamed 'Les Bleus'?",
    options: ["Belgium", "Italy", "France", "Brazil"],
    correctIndex: 2,
    funFact: "Les Bleus (The Blues) refers to France's blue home kit. They won in 1998 and 2018 — both at home and abroad.",
  },
  {
    question: "Who is Argentina's all-time top scorer and 2022 World Cup winner?",
    options: ["Maradona", "Batistuta", "Tevez", "Messi"],
    correctIndex: 3,
    funFact: "Messi finally won the World Cup in 2022 at age 35, shutting down the 'is he better than Maradona?' debate. (Mostly.)",
  },
  {
    question: "Which country hosted the 2018 World Cup?",
    options: ["Qatar", "Germany", "Russia", "South Africa"],
    correctIndex: 2,
    funFact: "Russia 2018 was the easternmost World Cup ever. Yekaterinburg's stadium was so small, they built temporary stands outside!",
  },
  {
    question: "How many substitutions are allowed per team during a World Cup match?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    funFact: "5 substitutions were made permanent after COVID-era experiments showed it actually improved quality of play.",
  },
  {
    question: "What is the name of the 2026 World Cup official match ball?",
    options: ["Jabulani", "Brazuca", "Telstar", "Vamos"],
    correctIndex: 2,
    funFact: "Adidas named the 2026 ball 'Telstar', a throwback to the iconic black-and-white ball from 1970. Nostalgia sells!",
  },
  {
    question: "Which nation made its World Cup debut at WC 2022?",
    options: ["Saudi Arabia", "Qatar", "Costa Rica", "Ecuador"],
    correctIndex: 1,
    funFact: "Qatar hosted AND participated for the first time in 2022. They went out in the group stage, but hosting is half the battle.",
  },
  {
    question: "How many host cities are in the USA for WC 2026?",
    options: ["9", "11", "13", "16"],
    correctIndex: 1,
    funFact: "11 US cities host games including New York, LA, Dallas, Miami, Atlanta, Boston, Seattle, SF, Kansas City, Philly, and Houston.",
  },
  {
    question: "Which player holds the record for most World Cup appearances?",
    options: ["Lothar Matthäus", "Ronaldo", "Paolo Maldini", "Cafu"],
    correctIndex: 0,
    funFact: "Lothar Matthäus played in 25 World Cup matches across 5 tournaments (1982–1998). A man who refused to retire.",
  },
  {
    question: "Saudi Arabia pulled off one of the biggest WC upsets in 2022 by beating who?",
    options: ["Germany", "Brazil", "Argentina", "France"],
    correctIndex: 2,
    funFact: "Saudi Arabia beat Argentina 2-1 despite Messi opening the scoring. The next day was declared a national holiday in Saudi Arabia!",
  },
  {
    question: "How many times has Italy won the World Cup?",
    options: ["3", "4", "5", "2"],
    correctIndex: 1,
    funFact: "Italy won 4 times (1934, 1938, 1982, 2006) — but failed to qualify for 2018 AND 2022. From champions to spectators.",
  },
  {
    question: "Which team has the famous 'Samba football' style?",
    options: ["Argentina", "Colombia", "Brazil", "Uruguay"],
    correctIndex: 2,
    funFact: "Brazil's 'Jogo Bonito' (beautiful game) style influenced football worldwide. Their 1970 team is still considered the greatest ever.",
  },
  {
    question: "What color jersey does England usually wear at home?",
    options: ["Red", "Blue", "White", "Yellow"],
    correctIndex: 2,
    funFact: "England wears white — fitting for a nation waiting since 1966 for their second star. Still waiting...",
  },
  {
    question: "Which player scored a hat-trick in the 2022 World Cup Final?",
    options: ["Messi", "Griezmann", "Giroud", "Mbappé"],
    correctIndex: 3,
    funFact: "Mbappé's Final hat-trick is only the second in WC Final history (after Geoff Hurst in 1966). France still lost.",
  },
  {
    question: "Who invented the 'bicycle kick'?",
    options: ["Pelé", "Ramón Unzaga", "Ronaldo", "Zidane"],
    correctIndex: 1,
    funFact: "Ramón Unzaga, a Chilean player, invented the bicycle kick in the early 1900s. Pelé just made it famous.",
  },
  {
    question: "Canada has co-hosted the World Cup before, in what year?",
    options: ["1986", "1994", "2002", "Never — 2026 is their first time"],
    correctIndex: 3,
    funFact: "2026 is Canada's first time hosting. They did host the Women's World Cup in 2015 though — so they've got some experience!",
  },
  {
    question: "What does VAR stand for in football?",
    options: ["Video Assistant Referee", "Visual Assistance Review", "Video Action Review", "Verified Arbitration Ruling"],
    correctIndex: 0,
    funFact: "VAR was introduced at WC 2018. It's added an average of 6 extra minutes per match — fans have mixed feelings.",
  },
  {
    question: "Which country won the 2014 World Cup in Brazil?",
    options: ["Brazil", "Argentina", "Germany", "Netherlands"],
    correctIndex: 2,
    funFact: "Germany crushed Brazil 7-1 in the semi-final at Brazil's own stadium. That game is still called 'Das Mineirazo' in Brazil.",
  },
  {
    question: "How long is extra time in a knockout World Cup match?",
    options: ["20 minutes", "30 minutes", "40 minutes", "15 minutes"],
    correctIndex: 1,
    funFact: "Two 15-minute halves of extra time. If still tied, penalties decide. Football's version of Russian roulette.",
  },
  {
    question: "Which Mexican city will host World Cup 2026 matches?",
    options: ["Cancún", "Guadalajara", "Acapulco", "Tijuana"],
    correctIndex: 1,
    funFact: "Mexico hosts matches in Mexico City, Guadalajara, and Monterrey. Azteca Stadium in Mexico City is a legendary venue!",
  },
  {
    question: "What year did the USA host the World Cup for the first time?",
    options: ["1990", "1992", "1994", "1998"],
    correctIndex: 2,
    funFact: "USA 1994 set World Cup attendance records that still stand today. Americans went wild for a sport they barely knew.",
  },
  {
    question: "Which player scored 5 goals in a single WC match (vs Cameroon)?",
    options: ["Gerd Müller", "Oleg Salenko", "Just Fontaine", "Ronaldo"],
    correctIndex: 1,
    funFact: "Oleg Salenko (Russia) scored 5 goals in one match in 1994 — and then scored no more goals in the tournament. Peaked early.",
  },
  {
    question: "Which team nicknamed 'The Socceroos' qualified for the 2026 WC?",
    options: ["New Zealand", "South Africa", "Australia", "Fiji"],
    correctIndex: 2,
    funFact: "Australia's Socceroos qualified for 2026! They're in Group C with USA, Paraguay, and Turkey. No easy games!",
  },
  {
    question: "How many players does each team register on their World Cup squad?",
    options: ["23", "25", "26", "28"],
    correctIndex: 2,
    funFact: "Since 2022, squads expanded from 23 to 26 players — 3 extra just in case your striker gets food poisoning.",
  },
  {
    question: "Spain's football style called 'tiki-taka' emphasizes what?",
    options: ["Long balls and headers", "Fast counter-attacks", "Short passing and possession", "Physical pressing"],
    correctIndex: 2,
    funFact: "Spain's tiki-taka dominated from 2008-2012, winning Euro 2008, WC 2010, and Euro 2012. Then everyone figured it out.",
  },
];

export function getTodayQuestionIndex(): number {
  const start = new Date("2026-06-11T00:00:00Z");
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const safeDay = Math.max(0, diffDays);
  return safeDay % TRIVIA_QUESTIONS.length;
}

export function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}
