export interface Counties {
  [name: string]: County
}
export interface County {
  name: string;
  emotions: Emotions;
  settlements: Settlement[];
}

export interface Settlement {
  name: string;
  emotions: Emotions;
}

export interface Emotions {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
}

export interface Hashtag {
  hashtag: string;
  count: number;
}

export function getCountiesData(): Promise<Counties> {
  return fetch('/api/counties')
    .then(data => data.json())
}


export function getHashtagData(): Promise<Hashtag[]> {
  return fetch('/api/hashtags')
    .then(data => data.json())
}


export function getBreakdownData(): Promise<Emotions> {
  return fetch('/api/breakdown')
    .then(data => data.json())
}

export function getJoyfulSettlements(): Promise<Settlement[]> {
  return fetch('/api/joyfulsettlements')
    .then(data => data.json())
}