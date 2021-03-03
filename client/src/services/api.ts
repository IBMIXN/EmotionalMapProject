export interface County {
  name: String;
  emotions:    Emotions;
  settlements: Settlements;
}

export interface Settlements {
  [name: string] : Emotions
}

export interface Emotions {
  joy:     number;
  fear:    number;
  anger:   number;
  sadness: number;
}

export function getEmotionData(): Promise<County[]> {
    return fetch('/api/map')
      .then(data => data.json())
  }