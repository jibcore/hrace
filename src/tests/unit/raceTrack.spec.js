import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import RaceTrack from "../../components/RaceTrack.vue";
import TrackLane from "../../components/TrackLane.vue";

describe("RaceTrack.vue", () => {
  const raceMock = {
    id: 42,
    distance: 500,
    racers: [
      { id: "r1", name: "Racer One", progress: 10 },
      { id: "r2", name: "Racer Two", progress: 20 },
      { id: "r3", name: "Racer Three", progress: 30 },
    ],
  };

  it("renders the title with race number and distance", () => {
    const wrapper = mount(RaceTrack, {
      propsData: { race: raceMock },
    });

    expect(wrapper.find(".race-track__title").text()).toBe(
      `Race #${raceMock.id}, Distance: ${raceMock.distance}m`
    );
  });

  it("renders the correct number of TrackLane components", () => {
    const wrapper = mount(RaceTrack, {
      propsData: { race: raceMock },
    });

    const lanes = wrapper.findAllComponents(TrackLane);
    expect(lanes.length).toBe(raceMock.racers.length);
  });

  it("passes the correct props to each TrackLane component", () => {
    const wrapper = mount(RaceTrack, {
      propsData: { race: raceMock },
    });

    const lanes = wrapper.findAllComponents(TrackLane);

    lanes.wrappers.forEach((laneWrapper, index) => {
      expect(laneWrapper.props("racer")).toEqual(raceMock.racers[index]);
    });
  });
});
