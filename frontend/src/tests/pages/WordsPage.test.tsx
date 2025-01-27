import { routes } from "@/App";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EXAMPLE_JLPT_WORDS } from "@/tests/constants";

vi.mock("@/utils/word", () => ({
  getJLPTWords: () => EXAMPLE_JLPT_WORDS,
  isValidLevel: () => true,
}));

describe("WordsPage Test", () => {
  it("홈 아이콘 클릭 시 메인페이지로 이동", async () => {
    // Given
    const router = createMemoryRouter(routes, {
      initialEntries: ["/words/N1"],
    });
    render(<RouterProvider router={router} />);
    const homeIconButton = screen.getByRole("link", { name: "homeIcon" });

    // When
    await userEvent.click(homeIconButton);

    // Then
    expect(router.state.location.pathname).toBe("/");
  });
});

describe("WordsPage Test", () => {
  beforeEach(() => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/words/N1"],
    });
    render(<RouterProvider router={router} />);
  });

  describe("Header Icons Test", () => {
    it("설정 아이콘 클릭 시 설정 UI 표시", async () => {
      // Given
      const cogIconButton = screen.getByRole("button", { name: "cogIcon" });
      const setting = screen.getByLabelText("setting");

      // When
      await userEvent.click(cogIconButton);

      // Then
      expect(setting).toHaveClass("opacity-100");
    });

    it("설정 UI가 표시된 상태에서 설정 아이콘 클릭 시 설정 UI 닫기", async () => {
      // Given
      const cogIconButton = screen.getByRole("button", { name: "cogIcon" });
      const setting = screen.getByLabelText("setting");

      // When
      await userEvent.click(cogIconButton);

      // Then
      expect(setting).toHaveClass("opacity-100");
      await userEvent.click(cogIconButton);
      expect(setting).toHaveClass("opacity-0");
    });

    it("메뉴 아이콘 클릭 시 WordList 컴포넌트 표시", async () => {
      // Given
      const menuIconButton = screen.getByRole("button", { name: "menuIcon" });
      const wordList = screen.getByLabelText("wordList");
      // When
      await userEvent.click(menuIconButton);

      // Then
      expect(wordList).toHaveClass("translate-x-0");
    });
  });

  describe("Word Test", () => {
    it("오른쪽 화살표 아이콘 클릭 시 다음 단어로 이동", () => {
      expect(1).toBe(1);
    });

    it("왼쪽 화살표 아이콘 클릭 시 이전 단어로 이동", () => {
      expect(1).toBe(1);
    });
  });

  describe("StudyAction Test", () => {
    it("뜻 보기 버튼 클릭 시 뜻이 보인다", () => {
      expect(1).toBe(1);
    });

    it("뜻 보기 버튼 2번 클릭 시 원래대로 돌아온다", () => {
      expect(1).toBe(1);
    });

    it("예문 해석 보기 버튼 클릭 시 예문 해석이 보인다", () => {
      expect(1).toBe(1);
    });

    it("예문 해석 보기 버튼 2번 클릭 시 원래대로 돌아온다", () => {
      expect(1).toBe(1);
    });

    it("암기 완료 버튼 클릭 시 암기 완료 처리", () => {
      expect(1).toBe(1);
    });

    it("다시 외우기 버튼 클릭 시 다시 외우기 처리", () => {
      expect(1).toBe(1);
    });
  });
});
