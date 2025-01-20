import { useEffect, useState, MouseEvent } from "react";
import { Navigate, useParams } from "react-router-dom";

import JLPT_N1_WORDS from "@/words/JLPT_N1_WORDS.json";
import JLPT_N2_WORDS from "@/words/JLPT_N2_WORDS.json";
import JLPT_N3_WORDS from "@/words/JLPT_N3_WORDS.json";
import JLPT_N4_WORDS from "@/words/JLPT_N4_WORDS.json";
import JLPT_N5_WORDS from "@/words/JLPT_N5_WORDS.json";
import StudyProgress from "@/components/StudyProgress";
import StudyAction from "@/components/StudyAction";

type Level = "N1" | "N2" | "N3" | "N4" | "N5";

type Word = {
  koreans: string[];
  original: string;
  pronunciation: string;
  kanji: string | null;
  level: Level;
  exampleSentences: {
    korean: string;
    japanese: string;
  }[];
};

const getWords = (level: Level) => {
  const levelWords = {
    N1: JLPT_N1_WORDS,
    N2: JLPT_N2_WORDS,
    N3: JLPT_N3_WORDS,
    N4: JLPT_N4_WORDS,
    N5: JLPT_N5_WORDS,
  };
  return levelWords[level];
};

const WordsPage = () => {
  const { level = "N1" } = useParams();

  if (!["N1", "N2", "N3", "N4", "N5"].includes(level || "")) {
    return <Navigate to="/" />;
  }

  const words = getWords(level as Level) as Word[];
  const totalLength = words.length;
  const memoryList = JSON.parse(
    (localStorage.getItem(level) as string) || "[]"
  );

  const [curIndex, setCurIndex] = useState(0);
  const [koreanHidden, setKoreanHidden] = useState(true);
  const [hiraganaHidden, setHiraganaHidden] = useState(true);
  const [showExampleSentences, setShowExampleSentences] = useState(false);

  const gotoNextWord = (nextIndex: number) => {
    while (memoryList.includes(nextIndex)) {
      nextIndex += 1;
    }
    setKoreanHidden(true);
    setHiraganaHidden(true);
    setShowExampleSentences(false);
    setCurIndex(nextIndex);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const buttonId = event.currentTarget.id;
    let nextIndex = curIndex + 1;

    switch (buttonId) {
      case "showMeaning":
        setKoreanHidden(!koreanHidden);
        setHiraganaHidden(!hiraganaHidden);
        break;
      case "showExampleSentences":
        setShowExampleSentences(!showExampleSentences);
        break;
      case "memorization":
        if (memoryList.length == totalLength - 1) {
          localStorage.setItem(level, JSON.stringify([]));
          return 0;
        }

        localStorage.setItem(level, JSON.stringify(memoryList));
        gotoNextWord(nextIndex);
        break;
      case "again":
        gotoNextWord(nextIndex);
        break;
      default:
        throw new Error("Invalid button id");
    }
  };

  useEffect(() => {
    let nextIndex = curIndex;
    while (memoryList.includes(nextIndex)) {
      nextIndex += 1;
    }
    setCurIndex(nextIndex);
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-between text-xl">
      <StudyProgress
        curIndex={curIndex}
        memoryListLength={memoryList.length}
        totalLength={totalLength}
      />
      <section className="flex flex-col items-center  w-full max-h-96 overflow-auto">
        <div className="text-3xl">
          {words[curIndex].kanji?.split("·").map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div>
          {hiraganaHidden ? "히라가나 숨김" : words[curIndex].pronunciation}
        </div>
        <div>
          {koreanHidden
            ? "한국어 숨김"
            : words[curIndex].koreans?.map((item) => (
                <div className="text-center" key={item}>
                  {item}
                </div>
              ))}
        </div>
        <div className="h-64 overflow-auto w-full">
          {words[curIndex].exampleSentences.map((item, index) => (
            <div key={index}>
              <div
                dangerouslySetInnerHTML={{
                  __html: showExampleSentences
                    ? item.japanese
                    : item.japanese.replace(/<rt>(.*?)<\/rt>/g, ""),
                }}
              />
              <div>{showExampleSentences && item.korean}</div>
            </div>
          ))}
        </div>
      </section>
      <StudyAction onClick={handleClick} />
    </main>
  );
};

export default WordsPage;
