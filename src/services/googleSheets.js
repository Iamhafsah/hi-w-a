
const API_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function getGuest(token) {
  const url = new URL(API_URL);

  url.searchParams.set("action", "guest");
  url.searchParams.set("token", token);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve invitation.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Invitation not found.");
  }

  return data.guest;
}

export async function getGuestById(guestId) {
  const url = new URL(API_URL);

  url.searchParams.set("action", "guestById");
  url.searchParams.set("guestId", guestId);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve guest information.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Guest not found.");
  }

  return data.guest;
}

export async function submitRSVP(token, response) {
  const url = new URL(API_URL);

  url.searchParams.set("action", "updateRSVP");
  url.searchParams.set("token", token);
  url.searchParams.set("response", response);

  const result = await fetch(url.toString());

  if (!result.ok) {
    throw new Error("Unable to submit RSVP.");
  }

  const data = await result.json();

  if (!data.success) {
    throw new Error(data.message || "RSVP submission failed.");
  }

  return data;
}