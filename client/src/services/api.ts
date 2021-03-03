export interface County {
  name: string;
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  settlements: Settlements[];
}

export interface Settlements {
  name: string;
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
}


export function getEmotionData(): Promise<County[]> {
    return fetch('/api/map')
      .then(data => data.json())
  }