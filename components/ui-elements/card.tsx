"use state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileType } from "@/app/create/page";
import { cn } from "@/lib/utils";

export default function Card({
  index,
  content,
  setFileData,
}: {
  index: number;
  content: FileType["contents"][number];
  setFileData: React.Dispatch<React.SetStateAction<FileType>>;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 border border-gray-300 p-4">
      <span className=" inline-block min-w-[3em] whitespace-nowrap text-right text-xl">
        {index + 1}.
      </span>
      <Input
        type="text"
        defaultValue={content.question}
        onChange={e => {
          setFileData(prev => {
            return {
              ...prev,
              contents:
                prev?.contents.map(c => {
                  if (c.id === content.id) {
                    return { ...c, question: e.target.value };
                  }
                  return c;
                }) || [],
            };
          });
        }}
        placeholder="問題"
        className="min-w-[3rem] flex-1 rounded border border-solid border-gray-400 p-2"
      />
      <Input
        type="text"
        defaultValue={content.answer}
        onChange={e => {
          setFileData(prev => {
            return {
              ...prev,
              contents:
                prev?.contents.map(c => {
                  if (c.id === content.id) {
                    return { ...c, answer: e.target.value };
                  }
                  return c;
                }) || [],
            };
          });
        }}
        placeholder="解答"
        className="min-w-[3rem] flex-1 rounded border border-solid border-gray-400 p-2"
      />
      <label className="relative block cursor-pointer select-none">
        <Checkbox
          className="hidden cursor-pointer"
          checked={content.isStared}
          onCheckedChange={() =>
            setFileData(prev => ({
              ...prev,
              contents: prev.contents.map(c =>
                c.id === content.id ? { ...c, isStared: !c.isStared } : c
              ),
            }))
          }
        />
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "relative left-0 top-0 h-[50px] w-[50px] fill-gray-600 transition-all duration-300 hover:scale-110",
            {
              "fill-yellow-300": content.isStared,
            }
          )}>
          <g>
            <g>
              <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
            </g>
          </g>
        </svg>
      </label>
      <Button
        onClick={() =>
          setFileData(prev => {
            return {
              ...prev,
              contents: prev?.contents?.filter(c => c.id !== content.id) || [],
            };
          })
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={`hsl(var(--primary-foreground))`}
          viewBox="0 0 256 256">
          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
        </svg>
      </Button>
    </div>
  );
}
