/* 
- Writing these test, especially in isolation ("poking holes in reality") using mock data doesn't accurately reflect the application usage using websockets.

- furthermore the API that was provided to us automatically updates  the days remaining, so in order to update the days remaining all we need to do is a simple get request for the days AFTER a put or delete has been done, then we update the state based on the returned information, in the websocket case this information is all coming via the returned message in the useEffect.

Therefore multiple tests we are writing in Module 8 Week 20 will not be functional with my current code, as specially mentioned in Week 20 debugging tests

*/

import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find((x) =>
      queryByText(x, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(
        appointment,
        "Are you sure you would like to delete this interview?"
      )
    ).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find((x) =>
      queryByText(x, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Cohana Roy"));

    await waitForElement(() => container, "Cohana Roy");
    expect(getByText(container, "Cohana Roy")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => container, "Lydia Miller-Jones");

    expect(queryByText(container, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(container, "Error"));
    expect(
      getByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    await waitForElement(() => getAllByTestId(container, "student-name-input"));
    fireEvent.click(getByText(appointment, "Cancel"));
    await waitForElement(() => getByText(container, "Archie Cohen"));

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("Shows the delete error when failing to delete an appointment", async () => {
    const { container } = render(<Application />);
    axios.delete.mockRejectedValueOnce();
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find((x) =>
      queryByText(x, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(
        appointment,
        "Are you sure you would like to delete this interview?"
      )
    ).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(container, "Error"));
    expect(
      getByText(appointment, "Could not delete appointment")
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(container, "Close"));

    await waitForElement(() => getByText(container, "Archie Cohen"));

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
