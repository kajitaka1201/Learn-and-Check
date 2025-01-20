import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { FileType } from "@/app/create/page";
import { FormSchema } from "./page";
import { useState } from "react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { cn } from "@/lib/utils";

export default function Use({
  fileData,
  setFileData,
  Settings,
}: {
  fileData: FileType;
  setFileData: React.Dispatch<React.SetStateAction<FileType>>;
  Settings: FormSchema;
}) {
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [idList, setIdList] = useState<string[]>(
    Settings.randomQuestion && Settings.limitToStarred
      ? fileData["contents"]
          .filter(e => !e.isStared)
          .map(c => c.id)
          .toSorted(() => Math.random() - 0.5)
      : Settings.randomQuestion
        ? fileData["contents"].map(c => c.id).toSorted(() => Math.random() - 0.5)
        : Settings.limitToStarred
          ? fileData["contents"].filter(e => !e.isStared).map(c => c.id)
          : fileData["contents"].map(c => c.id)
  );
  function handleReturn(): void {
    if (index !== 0) {
      setIndex(index - 1);
    }
    setIsDisplayed(false);
  }
  function handleNext(): void {
    if (index !== idList.length - 1) {
      setIndex(index + 1);
    }
    setIsDisplayed(false);
  }
  function checkAnswer(): void {
    if (Settings.useAnswerColumn === true) {
      if (inputValue === fileData["contents"].find(e => e.id === idList[index])?.answer) {
        alert("正解");
      } else {
        alert("不正解");
      }
    }
    setIsDisplayed(true);
  }
  useKeyboardShortcut(["d"], e => {
    e.preventDefault();
    handleNext();
  });
  useKeyboardShortcut(["ArrowRight"], e => {
    e.preventDefault();
    handleNext();
  });
  useKeyboardShortcut(["a"], e => {
    e.preventDefault();
    handleReturn();
  });
  useKeyboardShortcut(["ArrowLeft"], e => {
    e.preventDefault();
    handleReturn();
  });
  useKeyboardShortcut(["c"], e => {
    e.preventDefault();
    setFileData(prev => {
      return {
        ...prev,
        contents:
          prev?.contents.map(c => {
            if (c.id === idList[index]) {
              return { ...c, isStared: !c.isStared };
            }
            return c;
          }) || [],
      };
    });
  });
  useKeyboardShortcut(["ctrl", "enter"], e => {
    e.preventDefault();
    checkAnswer();
  });
  useKeyboardShortcut([" "], e => {
    e.preventDefault();
    checkAnswer();
  });

  return (
    <article className="flex-1">
      <div className="flex h-full flex-col gap-5">
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="grid w-full p-5">
            <div className="py-2">
              <p className="text-4xl">
                {fileData["contents"].find(e => e.id === idList[index])?.question}
              </p>
            </div>
            {isDisplayed ? (
              <div className="flex items-center gap-3 py-2">
                <p className="flex-1 text-4xl">
                  {fileData["contents"].find(e => e.id === idList[index])?.answer}
                </p>
                {(() => {
                  return (
                    <label className="relative block cursor-pointer select-none">
                      <Checkbox
                        className="hidden"
                        checked={fileData["contents"].find(e => e.id === idList[index])?.isStared}
                        onChange={() => {
                          return setFileData(prev => {
                            return {
                              ...prev,
                              contents:
                                prev?.contents.map(c => {
                                  if (c.id === idList[index]) {
                                    return { ...c, isStared: !c.isStared };
                                  }
                                  return c;
                                }) || [],
                            };
                          });
                        }}
                      />
                      <svg
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          "relative left-0 top-0 h-[50px] w-[50px] fill-gray-600 transition-all duration-300 hover:scale-110",
                          {
                            "fill-yellow-300": fileData["contents"].find(
                              e => e.id === idList[index]
                            )?.isStared,
                          }
                        )}>
                        <g>
                          <g>
                            <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
                          </g>
                        </g>
                      </svg>
                    </label>
                  );
                })()}{" "}
              </div>
            ) : (
              <Button onPress={checkAnswer}>確認</Button>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3"></div>
        <div className="relative flex-none">
          <div className="flex items-center justify-center">
            <div>
              <Button onPress={handleReturn} disabled={index === 0}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H107.31l18.35,18.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32L107.31,120H168A8,8,0,0,1,176,128Z" />
                </svg>
              </Button>
            </div>
            <div className="w-40 text-center">
              <p>
                <span>{index + 1}</span>/<span>{idList.length}</span>
              </p>
            </div>
            <div>
              <Button onPress={handleNext} disabled={index === idList.length - 1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32Z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
        {Settings.useAnswerColumn && (
          <div className="bg-blue-200 p-4">
            <Input type="text" placeholder="回答欄" onChange={e => setInputValue(e.target.value)} />
          </div>
        )}
      </div>
    </article>
  );
}
