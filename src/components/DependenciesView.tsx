import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChevronLeft } from 'react-feather';
import { fetchDependencies } from 'actions/dependenciesViewActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';
import IStoreState, { IBoardListState, IMyState, IDependenciesViewState } from 'store/IStoreState';
import { SquareSpinner } from 'styles/ThemeComponents';
import { ArcherContainer, ArcherElement, Relation, AnchorPosition } from 'react-archer';
import { colors } from 'tailwindcss/defaultTheme';

function DependenciesView() {
  const storeState = useSelector<IStoreState, { dependenciesViewState: IDependenciesViewState }>(
    state => ({
      dependenciesViewState: state.dependenciesViewState,
    })
  );

  const { dependenciesViewState = {} } = storeState;

  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>({ fetchDependencies }, dispatch);

  useEffect(() => {
    actions.fetchDependencies();
  }, []);

  const { isFetching, data } = dependenciesViewState;

  const teams = _.uniq(_.flatten(data.deps.map(d => [d.from.name, d.to.name])));
  const teamIds = _.mapValues(_.keyBy(teams.map((t, i) => ({ t, i })), 't'), t => t.i);

  const getId = (team, sprint) => `board-${teamIds[team]}-${sprint}`;

  const backlogId = data.maxSprint + 1;

  const depsBySourceId: { [id: string]: Relation[] } = _.mapValues(
    _.groupBy(
      data.deps.map(d => {
        const fromSprint = d.from.sprint || backlogId;
        const toSprint = d.to.sprint || backlogId;
        const key = getId(d.from.name, fromSprint);
        let sourceAnchor, targetAnchor: AnchorPosition;
        if (fromSprint === toSprint) {
          let fromI = teams.indexOf(d.from.name);
          let toI = teams.indexOf(d.to.name);
          console.log(d.from.name);
          console.log(d.to.name);
          if (fromI > toI) {
            sourceAnchor = 'top';
            targetAnchor = 'bottom';
          } else {
            sourceAnchor = 'bottom';
            targetAnchor = 'top';
          }
        } else if (fromSprint > toSprint) {
          sourceAnchor = 'left';
          targetAnchor = 'right';
        } else {
          sourceAnchor = 'right';
          targetAnchor = 'left';
        }
        const rel = { targetId: getId(d.to.name, toSprint), targetAnchor, sourceAnchor };
        return { key, rel };
      }),
      'key'
    ),
    t => t.map(x => x.rel)
  );

  return (
    <div className="flex flex-col w-1/2 mx-auto pt-20 relative">
      <Link to="/boards" className="mb-2 flex flex-row items-center">
        <ChevronLeft size="14" /> Boards
      </Link>
      <h1 className="text-gray-700 font-bold text-xl">Dependencies</h1>
      <div className="text-gray-600 py-4">
        This shows the cross-team dependencies by sprints. Each arrow represents the dependency of 1
        or more stories within a sprint to the stories in the same or another sprint across
        different teams.
      </div>
      {isFetching ? (
        <SquareSpinner className="mt-20" />
      ) : data ? (
        <ArcherContainer strokeColor={colors.teal[400]}>
          <table className="table-auto w-full">
            <thead>
              <tr className="block">
                <th className="w-1/5 inline-block" />
                {_.range(data.maxSprint).map((s, i) => (
                  <th key={s + i} className="w-1/5 inline-block">
                    Sprint {s + 1}
                  </th>
                ))}
                <th className="w-1/5 inline-block">Backlog</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, teamIndex) => (
                <tr key={t + teamIndex} className="block mb-2 p-2 rounded-sm bg-gray-200">
                  <td className="w-1/5 inline-block">{t}</td>
                  {_.range(data.maxSprint).map(s => {
                    const deps = depsBySourceId[getId(t, s + 1)];
                    return (
                      <td
                        key={t + teamIndex + s}
                        className="text-xs rounded-lg inline-block p-6 w-1/5 border-r-2 border-dashed"
                      >
                        <ArcherElement id={getId(t, s + 1)} relations={deps}>
                          <div className="rounded-sm border-gray-300 border-2 p-4 bg-white">
                            {t} sprint {s + 1}
                          </div>
                        </ArcherElement>
                      </td>
                    );
                  })}
                  <td className="text-sm inline-block rounded-lg w-1/5">
                    <ArcherElement
                      id={getId(t, backlogId)}
                      relations={depsBySourceId[getId(t, backlogId)]}
                    >
                      <div className="rounded-sm border-gray-300 border-2 p-4 bg-white">
                        {t} backlog
                      </div>
                    </ArcherElement>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ArcherContainer>
      ) : (
        <div className="italic text-gray-400 text-center">No dependencies yet!</div>
      )}
    </div>
  );
}

export default DependenciesView;