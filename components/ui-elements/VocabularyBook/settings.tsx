import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { formSchema } from "./page";

export default function Settings({
  setSettings,
  start,
}: {
  setSettings: React.Dispatch<React.SetStateAction<z.infer<typeof formSchema>>>;
  start: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useAnswerColumn: false,
      randomQuestion: false,
      limitToStarred: false,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSettings(values);
    start();
  }
  return (
    <article className="grid justify-items-center rounded-2xl border-2 border-blue-600 p-5">
      <h1 className="text-4xl">単語帳設定</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-2">
          <FormField
            control={form.control}
            name="useAnswerColumn"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="w-full">解答欄機能を使用する</FormLabel>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="randomQuestion"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="w-full">ランダムに出題する</FormLabel>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="limitToStarred"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="w-full">スターが付いた物に限定する</FormLabel>
                </FormItem>
              );
            }}
          />
          <Button type="submit">スタート</Button>
        </form>
      </Form>
    </article>
  );
}
