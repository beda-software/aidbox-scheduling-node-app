import React from 'react';
import { useStore, useGate } from 'effector-react';
import Spinner from '../../../components/Spinner';
import { isFailure, isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import * as smartAppModel from '../../../models/smart-app';
import { SmartApp } from './smartApp';

export const PractitionerSmartApps = () => {
  useGate(smartAppModel.SmartAppGate);
  const smartAppsResult = useStore(smartAppModel.$smartApps);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              Smart Apps
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        {isFailure(smartAppsResult) && (
          <div className="flex flex-wrap -m-4">
            <div className="text-red-500 pl-4 font-medium">{smartAppsResult.error}</div>
          </div>
        )}
        {isLoading(smartAppsResult) && (
          <div className="flex flex-wrap -m-4">
            <Spinner />
          </div>
        )}
        {isSuccess(smartAppsResult) && (
          <div className="flex flex-wrap -m-4">
            {smartAppsResult.data.map((smartApp: smartAppModel.SmartApp) => (
              <React.Fragment key={smartApp.id}>
                <SmartApp {...smartApp} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};