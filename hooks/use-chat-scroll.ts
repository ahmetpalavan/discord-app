import { useEffect, useState } from "react";

type Props = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

const useChatScroll = (props: Props) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const topDiv = props.chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && props.shouldLoadMore) {
        setIsScrolling(true);
        props.loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [props.chatRef, props.shouldLoadMore, props.loadMore, props]);

  useEffect(() => {
    const bottomDiv = props.bottomRef?.current;
    const topDiv = props.chatRef?.current;
    const shouldAutoScroll = () => {
      if (!isScrolling && bottomDiv) {
        setIsScrolling(true);
        return true;
      }
    };
    

  }, []);
};

export default useChatScroll;
