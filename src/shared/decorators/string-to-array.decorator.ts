import { Transform } from 'class-transformer';

export function StringToArray(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.split(',').map((e) => Number(e));
  });
}
