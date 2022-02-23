/* eslint-disable */
import React from "react";
import { Gapi } from "./gapi.js";
export default {
  title: "Store/Reducers/Gapi",
  component: Gapi,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const Template = () => <Gapi />;

export const component = Template.bind({});
