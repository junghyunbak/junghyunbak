import { Markdown } from ".";
import { render, screen } from "@testing-library/react";

const markdown = `
![image1](https://mockapi/image/1)

![image2]()

![image3](https://mockapi/wrong/url)

<img src="https://mockapi/image/4" alt="image4"/>

<iframe src="https://mockapi/not/image"/>
`;

it("모든 이미지가 올바르게 렌더링되는지 확인한다.", () => {
  render(<Markdown markdown={markdown} />);

  const alts = ["image1", "image2", "image3", "image4"];

  for (const alt of alts) {
    const image = screen.getByAltText(alt);

    expect(image).toBeInTheDocument();
  }
});
