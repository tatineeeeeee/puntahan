import { describe, it, expect } from "vitest";
import {
  computeUserBadges,
  getHighestBadge,
  computeLocalGuideBadges,
  BADGE_DEFINITIONS,
} from "../badges";

describe("computeUserBadges", () => {
  it("returns empty array for zero stats", () => {
    const result = computeUserBadges({
      tipsCount: 0,
      upvotesReceived: 0,
      destinationsVisited: 0,
      photosUploaded: 0,
    });
    expect(result).toEqual([]);
  });

  it("returns Explorer badge at 5 tips", () => {
    const result = computeUserBadges({
      tipsCount: 5,
      upvotesReceived: 0,
      destinationsVisited: 0,
      photosUploaded: 0,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("explorer");
  });

  it("returns Explorer and Local Guide at 20 tips", () => {
    const result = computeUserBadges({
      tipsCount: 20,
      upvotesReceived: 0,
      destinationsVisited: 0,
      photosUploaded: 0,
    });
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.id)).toContain("explorer");
    expect(result.map((b) => b.id)).toContain("local-guide");
  });

  it("returns all badges when all thresholds met", () => {
    const result = computeUserBadges({
      tipsCount: 20,
      upvotesReceived: 50,
      destinationsVisited: 10,
      photosUploaded: 20,
    });
    expect(result).toHaveLength(BADGE_DEFINITIONS.length);
  });

  it("does not earn badge at threshold - 1", () => {
    const result = computeUserBadges({
      tipsCount: 4, // Explorer needs 5
      upvotesReceived: 49, // Trailblazer needs 50
      destinationsVisited: 9, // Wanderer needs 10
      photosUploaded: 19, // Photographer needs 20
    });
    expect(result).toHaveLength(0);
  });
});

describe("getHighestBadge", () => {
  it("returns null for zero stats", () => {
    expect(
      getHighestBadge({
        tipsCount: 0,
        upvotesReceived: 0,
        destinationsVisited: 0,
        photosUploaded: 0,
      }),
    ).toBeNull();
  });

  it("returns the last earned badge", () => {
    const badge = getHighestBadge({
      tipsCount: 20,
      upvotesReceived: 50,
      destinationsVisited: 0,
      photosUploaded: 0,
    });
    expect(badge).not.toBeNull();
    expect(badge!.id).toBe("trailblazer");
  });
});

describe("computeLocalGuideBadges", () => {
  it("returns empty for low counts", () => {
    expect(computeLocalGuideBadges({ Cebu: 5, Bohol: 3 })).toHaveLength(0);
  });

  it("returns badge at threshold (10)", () => {
    const result = computeLocalGuideBadges({ Cebu: 10, Bohol: 3 });
    expect(result).toHaveLength(1);
    expect(result[0].province).toBe("Cebu");
    expect(result[0].tipsCount).toBe(10);
  });

  it("returns multiple province badges", () => {
    const result = computeLocalGuideBadges({ Cebu: 15, Bohol: 12, Palawan: 5 });
    expect(result).toHaveLength(2);
  });

  it("returns empty for empty input", () => {
    expect(computeLocalGuideBadges({})).toHaveLength(0);
  });
});
