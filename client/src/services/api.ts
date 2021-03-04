export interface Counties {
  [name: string] : County
}
export interface County {
  name: string;
  emotions: Emotions;
  settlements: Settlements[];
}

export interface Settlements {
  name: string;
  emotions: Emotions;
}

export interface Emotions {
  joy:     number;
  fear:    number;
  anger:   number;
  sadness: number;
}

export function getEmotionData(): Promise<Counties> {
    return fetch('/api/counties')
      .then(data => data.json())
  }