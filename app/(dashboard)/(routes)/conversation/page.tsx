'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { Heading } from '@/components/heading';
import { formSchema } from './constants';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      setMessages(current => [...current, userMessage, response.data]);

      form.reset();
    } catch (error) {
      // TODO: Open pro model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of the sun?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8 rounded-lg w-full bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">
                  {typeof message.content === 'string'
                    ? message.content
                    : JSON.stringify(message.content)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
