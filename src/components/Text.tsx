import React from "react";

type TextProps = { title: string };

const Text: React.FC<TextProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default Text;
