export interface EmotionData {
  counties: Counties;
}

export interface Counties {
  [name: string] : County
}

export interface County {
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

export function getEmotionData(): Promise<EmotionData> {
    return fetch('/api/map')
      .then(data => data.json())
  }