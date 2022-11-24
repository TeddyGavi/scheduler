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
  prettyDOM,
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
    // 1. Render the Application.
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 2. Wait until the text "Archie Cohen" is displayed.
    const appointment = getAllByTestId(container, "appointment").find((x) =>
      queryByText(x, "Archie Cohen")
    );
    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        "Are you sure you would like to delete this interview?"
      )
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining". // 2. Wait until the text "Archie Cohen" is displayed.
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the App
    const { container } = render(<Application />);
    // 2. wait until the app has rendered the text if "Archie Cohen"

    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Select that appointment

    const appointment = getAllByTestId(container, "appointment").find((x) =>
      queryByText(x, "Archie Cohen")
    );
    // 4. Click the "Edit button"
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 5. Change the student name and interview name and click save;
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Cohana Roy"));

    // 6. wait for elements to load and save the data
    await waitForElement(() => container, "Cohana Roy");
    expect(getByText(container, "Cohana Roy")).toBeInTheDocument();

    // 7. Save the data
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
    // wait for load
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // get appointment
    const appointment = getAllByTestId(container, "appointment")[0];
    // click the "add appointment button"
    fireEvent.click(getByAltText(appointment, "Add"));
    // change the name of the text input
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    // chose an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // wait for the mock to be rejected make sure the error message is displayed
    await waitForElement(() => getByText(container, "Error"));
    expect(
      getByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();
    // close the error
    fireEvent.click(getByAltText(appointment, "Close"));
    // the form is shown again
    await waitForElement(() => getAllByTestId(container, "student-name-input"));
    // click cancel
    fireEvent.click(getByText(appointment, "Cancel"));
    // wait for the original container to load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
    // make sure the days are the same, ie the spots haven't changed from the mock data
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
    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();
    fireEvent.click(getByAltText(container, "Close"))
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
    // make sure the days are the same, ie the spots haven't changed from the mock data
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
