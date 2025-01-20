"use client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Card from "@/components/ui-elements/card";
import { useState } from "react";
import { v4 as createUUID } from "uuid";
import { downloadFile } from "@/lib/download";
import { uploadFile } from "@/lib/upload";
import VocabularyBook from "@/components/ui-elements/VocabularyBook/page";
import { Textarea } from "@heroui/input";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { UUID } from "crypto";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";

export type FileType = {
  id: UUID;
  name: string;
  explanation: string;
  contents: {
    id: UUID;
    question: string;
    answer: string;
    isStared: boolean;
  }[];
};
export type ResultType = {
  id: UUID; // same as FileType.id
  contents: {
    id: UUID; // same as FileType.contents.id
    correctRate: number;
    latestResult: boolean;
    lastUpdated: string;
  }[];
};

export default function Create() {
  const [fileData, setFileData] = useState<FileType>({
    name: "",
    explanation: "",
    id: createUUID() as UUID,
    contents: [],
  });
  console.log(fileData);
  console.log(fileData["contents"].length);
  const [resultData, setResultData] = useState<ResultType>({
    id: createUUID() as UUID,
    contents: [],
  });
  const [importedCSV, setImportedCSV] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVocabularyStarted, setIsVocabularyStarted] = useState<boolean>(false);

  function addCard() {
    setFileData({
      ...fileData,
      contents: [
        ...(fileData?.contents || []),
        { question: "", answer: "", id: createUUID() as UUID, isStared: false },
      ],
    });
  }
  function importFromCSV() {
    const csv = importedCSV;
    const lines = csv.split("\n");
    const newContents = lines.map(line => {
      const [question, answer] = line.split("\t");
      return {
        question,
        answer,
        id: createUUID() as UUID,
        isStared: false,
      };
    });
    setFileData({
      ...fileData,
      contents: [...(fileData?.contents || []), ...newContents],
    });
    setIsModalOpen(false);
  }
  function download() {
    downloadFile({
      name: `${fileData?.name}.learn-and-check.json`,
      content: JSON.stringify(fileData),
    });
  }
  function upload() {
    uploadFile().then(data => {
      setFileData(JSON.parse(data.content));
    });
  }
  function reverseQA() {
    setFileData({
      ...fileData,
      contents: fileData?.contents.map(content => {
        return {
          ...content,
          question: content.answer,
          answer: content.question,
        };
      }),
    });
  }

  useKeyboardShortcut(["ctrl", "m"], e => {
    e.preventDefault();
    addCard();
  });
  useKeyboardShortcut(["ctrl", "s"], e => {
    e.preventDefault();
    download();
  });
  useKeyboardShortcut(["ctrl", "o"], e => {
    e.preventDefault();
    upload();
  });
  useKeyboardShortcut(["ctrl", "enter"], e => {
    e.preventDefault();
    setIsVocabularyStarted(true);
  });

  return (
    <main className="m-auto flex max-w-6xl flex-col gap-6 px-5 py-10">
      <div className="flex flex-col gap-2">
        {/* title input */}
        <Input
          type="text"
          value={fileData?.name}
          onChange={e => setFileData({ ...fileData, name: e.target.value } as FileType)}
          placeholder="ファイル名を入力して下さい"
          label="ファイル名"
        />
        {/* explanation input */}
        <Input
          type="text"
          value={fileData?.explanation}
          onChange={e => setFileData({ ...fileData, explanation: e.target.value } as FileType)}
          placeholder="説明を入力して下さい"
          label="説明"
        />
      </div>

      <div>
        {/* import Modal */}
        <Button onPress={() => setIsModalOpen(!isModalOpen)}>CSVからインポートする</Button>
        <Modal isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
          <ModalContent className="flex h-4/5 w-4/5 max-w-none flex-col">
            <ModalHeader className="flex-none">CSVファイルのインポート</ModalHeader>
            <div className="m-5 flex flex-1 flex-col gap-3">
              <Textarea
                className="![&>div]:h-none ![&>textarea]:h-none flex-1 [&>]:"
                value={importedCSV}
                onChange={e => setImportedCSV(e.target.value)}
                placeholder={`GoogleスプレッドシートやExcelからインポートすることが出来ます。\n問題\t答え\n問題\t答え...\nの形式で入力してください。`}
              />
              <Button onPress={importFromCSV} className="flex-none">
                確定する
              </Button>
            </div>
          </ModalContent>
        </Modal>
        <Button onPress={reverseQA}>問題と答えを入れ替える</Button>
      </div>

      {/* Card */}
      <div className="grid w-full min-w-[12.5rem] list-decimal gap-2">
        {fileData?.contents?.map((content, index) => (
          <Card key={content.id} index={index} content={content} setFileData={setFileData} />
        ))}
        {/* new card */}
        <Button onPress={addCard}>カードを追加する</Button>
      </div>

      {/* button */}
      <div>
        {/* save button */}
        <Button onPress={download}>保存する</Button>
        {/* start button */}
        <Button
          isDisabled={fileData.contents.length === 0}
          onPress={() => setIsVocabularyStarted(!isVocabularyStarted)}>
          単語帳を開始する
        </Button>
      </div>

      {/* 単語帳 */}
      <VocabularyBook
        fileData={fileData}
        setFileData={setFileData}
        isVocabularyStarted={isVocabularyStarted}
        setIsVocabularyStarted={setIsVocabularyStarted}
      />
    </main>
  );
}
