import { Scope } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('multiple optional dependencies', () => {
  const MY_PROVIDER = 'MY_PROVIDER';
  const FIRST_OPTIONAL_DEPENDENCY = 'FIRST_OPTIONAL_DEPENDENCY';
  const SECOND_OPTIONAL_DEPENDENCY = 'SECOND_OPTIONAL_DEPENDENCY';

  describe.each([Scope.DEFAULT, Scope.TRANSIENT, Scope.REQUEST])(
    'for a %s scoped provider',
    (scope: Scope) => {
      describe('none are defined', () => {
        it('it should resolve the provider without dependencies', async () => {
          const module = await Test.createTestingModule({
            providers: [
              {
                provide: MY_PROVIDER,
                scope,
                inject: [
                  {
                    token: FIRST_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                  {
                    token: SECOND_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                ],
                useFactory: (first?: string, second?: string) => {
                  return { first, second };
                },
              },
            ],
          }).compile();

          expect(await module.resolve(MY_PROVIDER)).toEqual({
            first: undefined,
            second: undefined,
          });
        });
      });

      describe('only first one is defined', () => {
        it('it should resolve the provider with 1 dependency', async () => {
          const module = await Test.createTestingModule({
            providers: [
              {
                provide: FIRST_OPTIONAL_DEPENDENCY,
                useValue: 'first',
              },
              {
                provide: MY_PROVIDER,
                scope,
                inject: [
                  {
                    token: FIRST_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                  {
                    token: SECOND_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                ],
                useFactory: (first?: string, second?: string) => {
                  return { first, second };
                },
              },
            ],
          }).compile();

          expect(await module.resolve(MY_PROVIDER)).toEqual({
            first: 'first',
            second: undefined,
          });
        });
      });

      describe('only second one is defined', () => {
        it('it should resolve the provider with 1 dependency', async () => {
          const module = await Test.createTestingModule({
            providers: [
              {
                provide: SECOND_OPTIONAL_DEPENDENCY,
                useValue: 'second',
              },
              {
                provide: MY_PROVIDER,
                scope,
                inject: [
                  {
                    token: FIRST_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                  {
                    token: SECOND_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                ],
                useFactory: (first?: string, second?: string) => {
                  return { first, second };
                },
              },
            ],
          }).compile();

          expect(await module.resolve(MY_PROVIDER)).toEqual({
            first: undefined,
            second: 'second',
          });
        });
      });

      describe('both dependencies are defined', () => {
        it('it should resolve the provider with 1 dependency', async () => {
          const module = await Test.createTestingModule({
            providers: [
              {
                provide: FIRST_OPTIONAL_DEPENDENCY,
                useValue: 'first',
              },
              {
                provide: SECOND_OPTIONAL_DEPENDENCY,
                useValue: 'second',
              },
              {
                provide: MY_PROVIDER,
                scope,
                inject: [
                  {
                    token: FIRST_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                  {
                    token: SECOND_OPTIONAL_DEPENDENCY,
                    optional: true,
                  },
                ],
                useFactory: (first?: string, second?: string) => {
                  return { first, second };
                },
              },
            ],
          }).compile();

          expect(await module.resolve(MY_PROVIDER)).toEqual({
            first: 'first',
            second: 'second',
          });
        });
      });
    },
  );
});
