import { useState, MouseEvent } from "react";
import { Navigate, useParams } from "react-router-dom";

import JLPT_N1_WORDS from "@/words/JLPT_N1_WORDS.json";
import JLPT_N2_WORDS from "@/words/JLPT_N2_WORDS.json";
import JLPT_N3_WORDS from "@/words/JLPT_N3_WORDS.json";
import JLPT_N4_WORDS from "@/words/JLPT_N4_WORDS.json";
import JLPT_N5_WORDS from "@/words/JLPT_N5_WORDS.json";
import StudyProgress from "@/components/StudyProgress";
import StudyAction from "@/components/StudyAction";
import { useLocalStorage, setLocalStorage } from "@/hooks/useLocalStorage";
import { LEVELS } from "@/constants/word";

type Level = (typeof LEVELS)[number];

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

const levelWords = {
  N1: JLPT_N1_WORDS,
  N2: JLPT_N2_WORDS,
  N3: JLPT_N3_WORDS,
  N4: JLPT_N4_WORDS,
  N5: JLPT_N5_WORDS,
};

const WordsPage = () => {
  const { level = "" } = useParams();

  if (!["N1", "N2", "N3", "N4", "N5"].includes(level)) {
    return <Navigate to="/" />;
  }

  const words = levelWords[level as Level] as Word[];
  const totalLength = words.length;
  const { memoryList, curIndex } = useLocalStorage<{
    memoryList: number[];
    curIndex: number;
  }>(level, {
    memoryList: [],
    curIndex: 0,
  });

  const [koreanHidden, setKoreanHidden] = useState(true);
  const [hiraganaHidden, setHiraganaHidden] = useState(true);
  const [showExampleSentences, setShowExampleSentences] = useState(false);

  const initWord = () => {
    setKoreanHidden(true);
    setHiraganaHidden(true);
    setShowExampleSentences(false);
  };

  const getNextIndex = (curIndex: number, memoryList: number[]) => {
    let nextIndex = curIndex + 1;
    while (memoryList.includes(nextIndex)) {
      nextIndex += 1;
    }
    return nextIndex;
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const buttonId = event.currentTarget.id;
    const nextIndex = getNextIndex(curIndex, memoryList);

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
          return 0;
        }

        initWord();
        setLocalStorage(
          level,
          JSON.stringify({
            memoryList: [...memoryList, curIndex],
            curIndex: nextIndex,
          })
        );
        break;
      case "again":
        initWord();
        setLocalStorage(
          level,
          JSON.stringify({ memoryList, curIndex: nextIndex })
        );
        break;
      default:
        throw new Error("Invalid button id");
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4">
      <section className="w-full">
        <StudyProgress
          curIndex={curIndex}
          memoryListLength={memoryList.length}
          totalLength={totalLength}
        />
        <section className="flex flex-col items-center  w-full max-h-96 overflow-auto">
          <div className="text-4xl">
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
          <div className="h-64 overflow-auto w-full text-xl">
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
      </section>

      <StudyAction onClick={handleClick} />
    </main>
  );
};

export default WordsPage;
