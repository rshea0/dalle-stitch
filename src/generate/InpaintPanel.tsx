import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  chakra,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { GenerationHistory } from '../components/GenerationHistory';
import { SuccessfulDalleTask } from '../dalle';
import { models, useStores } from '../store';
import { ImageBase64 } from '../utils';

export const InpaintPanel = chakra(observer(_InpaintPanel));

function _InpaintPanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: { selectionAreaImage, closePanel },
    taskStore: { loadResult },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const inpaint = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectionAreaImage) {
      return;
    }

    setIsGenerating(true);
    const image = selectionAreaImage.split(',')[1] as ImageBase64;

    try {
      const task = (await dalle.generateInpainting({
        prompt,
        maskedImage: image,
        sourceImage: image,
      })) as SuccessfulDalleTask;
      await loadResult(task);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Flex
      padding={4}
      minHeight={0}
      background={'white'}
      boxShadow={'window-left'}
      borderLeftRadius={'lg'}
      direction={'column'}
      gap={4}
      {...passthrough}
    >
      <Flex justify={'space-between'}>
        <Heading size={'lg'}>Inpaint</Heading>
        <IconButton
          onClick={closePanel}
          icon={<ArrowRightIcon />}
          aria-label='Close panel'
          alignSelf={'start'}
        />
      </Flex>

      <chakra.form
        onSubmit={inpaint}
        flexGrow={1}
      >
        <Input
          placeholder='Use your imagination 🌈'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </chakra.form>

      {selectionAreaImage && (
        <Image
          src={selectionAreaImage}
          background='transparent-bg'
          maxHeight={models.Generation.DISPLAY_SIZE / 2}
          alignSelf={'center'}
        />
      )}

      {isGenerating ? <Spinner size={'xl'} /> : <GenerationHistory />}
    </Flex>
  );
}
