import {Composition} from 'remotion';
import {AsteroidSimulation} from './AsteroidSimulation';

export const RemotionRoot = () => {
  return (
    <Composition
      id="AsteroidSimulation"
      component={AsteroidSimulation}
      durationInFrames={2040}
      fps={30}
      width={1200}
      height={2000}
    />
  );
};
