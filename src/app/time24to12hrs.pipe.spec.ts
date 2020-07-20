import { Time24to12hrsPipe } from './time24to12hrs.pipe';

describe('Time24to12hrsPipe', () => {
  it('create an instance', () => {
    const pipe = new Time24to12hrsPipe();
    expect(pipe).toBeTruthy();
  });
});
