import { MouseEvent } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useLocalStorage, setLocalStorage } from "@/hooks/useLocalStorage";
import { LEVELS } from "@/constants/word";
import {
  StudyAction,
  StudyProgress,
  ExampleSentences,
  Word,
} from "@/components";
import { useWord } from "@/hooks/useWord";
import { getJLPTWords, getNextIndex } from "@/utils/word";
import type { Level, Word as WordType } from "@/types/word";
import { useStudyAction } from "@/hooks/useStudyAction";

const WordsPage = () => {
  const { level = "" } = useParams();
  const navigate = useNavigate();
  const { memoryList, curIndex } = useLocalStorage<{
    memoryList: number[];
    curIndex: number;
  }>(level, {
    memoryList: [],
    curIndex: 0,
  });
  const words = getJLPTWords(level as Level) as WordType[];
  const totalLength = words.length;

  if (!LEVELS.includes(level as Level) || memoryList.length === totalLength) {
    return <Navigate to="/" />;
  }

  const { kanji, pronunciation, koreans, exampleSentences } = words[curIndex];

  const {
    handleStudyActionClick,
    showWordMeaning,
    showExampleSentencesMeaning,
    initWord,
  } = useStudyAction();

  const handleGoPrevWord = () => {
    const prevIndex = curIndex > 0 ? curIndex - 1 : totalLength - 1;
    initWord();
    setLocalStorage(level, JSON.stringify({ memoryList, curIndex: prevIndex }));
  };

  const handleGoNextWord = () => {
    const nextIndex = getNextIndex(curIndex, memoryList, totalLength);
    initWord();
    setLocalStorage(level, JSON.stringify({ memoryList, curIndex: nextIndex }));
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4">
      <section className="w-full">
        <StudyProgress
          curIndex={curIndex}
          memoryListLength={memoryList.length}
          totalLength={totalLength}
          onGoPrevWord={handleGoPrevWord}
          onGoNextWord={handleGoNextWord}
        />
        <section className="w-full max-h-96 overflow-auto">
          <Word
            kanji={kanji}
            pronunciation={pronunciation}
            koreans={koreans}
            showMeaning={showWordMeaning}
          />
          <ExampleSentences
            sentences={exampleSentences}
            showMeaning={showExampleSentencesMeaning}
          />
        </section>
      </section>

      <StudyAction onClick={handleStudyActionClick} />
    </main>
  );
};

export default WordsPage;
