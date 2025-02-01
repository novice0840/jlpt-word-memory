import { useNavigate, useParams } from "react-router-dom";
import { MouseEvent } from "react";
import { getNextUnmemorizedIndex } from "@/utils/word";
import { getHSKWords } from "@/utils/chinese";
import { setLocalStorage } from "./useLocalStorage";
import { Level } from "@/types/word";
import { useWord } from "./useWord";
import { useGetMemoryList } from "./useGetMemoryList";
import { useDialog } from "@/context/DialogContext";

const useStudyAction = () => {
  const { level = "" } = useParams();
  const { memoryList, curIndex } = useGetMemoryList(level as Level);
  const words = getHSKWords(level);

  const totalLength = words.length;
  const { open } = useDialog();
  const navigate = useNavigate();

  const {
    showWordMeaning,
    showSentencesMeaning,
    setShowWordMeaning,
    setShowSentencesMeaning,
    initWord,
  } = useWord();

  const handleStudyActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    const buttonId = event.currentTarget.id;
    const nextIndex = getNextUnmemorizedIndex(
      curIndex,
      memoryList,
      totalLength
    );

    switch (buttonId) {
      case "meaning":
        setShowWordMeaning(!showWordMeaning);
        break;
      case "sentence":
        setShowSentencesMeaning(!showSentencesMeaning);
        break;
      case "memorization":
        initWord();
        setLocalStorage(level, {
          memoryList: memoryList.includes(curIndex)
            ? memoryList
            : [...memoryList, curIndex],
          curIndex: nextIndex,
        });

        if (memoryList.length === totalLength - 1) {
          open({
            title: "모든 단어를 외웠습니다 🎉",
            description: "확인 버튼을 누르면 홈으로 돌아갑니다",
            onConfirmClick: () => {
              navigate("/");
            },
          });
        }

        break;
      case "again":
        initWord();
        setLocalStorage(level, { memoryList, curIndex: nextIndex });
        break;
      default:
        throw new Error("Invalid button id");
    }
  };
  return {
    handleStudyActionClick,
    showWordMeaning,
    showSentencesMeaning,
    initWord,
  };
};

export { useStudyAction };
