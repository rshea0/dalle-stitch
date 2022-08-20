import { chain, keyBy } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta, SuccessfulDalleTask } from '../dalle';
import { Generation } from './models';
import { RootStore } from './root-store';

export class GenerateStore {
  get #dalle() {
    return this.#rootStore.dalle;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'GenerateStore',
      properties: [
        //
        'generations',
      ],
    });
  }

  generations: { [id: string]: Generation } = {};

  get generationHistory(): Generation[][] {
    return chain(Object.values(this.generations))
      .orderBy(g => g.created_at, 'desc')
      .chunk(4)
      .value();
  }

  async add(dtos: DalleGenerationMeta[]) {
    const generations = await Promise.all(
      dtos.map(dto => Generation.fromApi(dto, this.#dalle)),
    );

    runInAction(() => {
      Object.assign(
        this.generations,
        keyBy(generations, g => g.id),
      );
    });
  }

  async addFromTask(task: SuccessfulDalleTask) {
    await this.add(task.generations.data);
  }
}
