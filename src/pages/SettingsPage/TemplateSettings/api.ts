import {Templates} from "../../../../types";

export const getAllTemplates = async (): Promise<Templates> => {
  return await fetch('/api/descriptions', {credentials: 'include'}).then(res => res.json())
}

export const saveTemplate = async (data: {organ: string, title: string, description: string}) => {
  return await fetch('/api/description', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data)
  }).then(res => res.json())
}

export const deleteTemplate = async (data: {organ: string, type: string}) => {
  const queryParams = new URLSearchParams(data).toString();
  return await fetch(`/api/description?${queryParams}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data)
  })
}
