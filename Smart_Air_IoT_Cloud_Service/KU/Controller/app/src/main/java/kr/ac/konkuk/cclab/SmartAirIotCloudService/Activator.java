 package kr.ac.konkuk.cclab.SmartAirIotCloudService;

import java.util.Dictionary;
import java.util.Hashtable;
import org.apache.felix.dm.Component;
import org.opendaylight.controller.hosttracker.IfHostListener;
import org.opendaylight.controller.hosttracker.IfIptoHost;
import org.opendaylight.controller.hosttracker.IfNewHostNotify;
import org.opendaylight.controller.hosttracker.hostAware.IHostFinder;
import org.opendaylight.controller.sal.core.ComponentActivatorAbstractBase;
import org.opendaylight.controller.sal.flowprogrammer.IFlowProgrammerService;
import org.opendaylight.controller.sal.packet.IDataPacketService;
import org.opendaylight.controller.sal.packet.IListenDataPacket;
import org.opendaylight.controller.sal.topology.IListenTopoUpdates;
import org.opendaylight.controller.switchmanager.ISwitchManager;
import org.opendaylight.controller.topologymanager.ITopologyManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Activator extends ComponentActivatorAbstractBase {

    private static final Logger log = LoggerFactory.getLogger(PacketHandler.class);

    @Override
    public Object[] getImplementations() {
        System.out.println("Getting Implementations");

        Object[] res = {PacketHandler.class};
        return res;
    }

    @Override
    public void configureInstance(Component c, Object imp, String containerName) {
        if (imp.equals(PacketHandler.class)) {

            Dictionary<String, Object> props = new Hashtable<String, Object>();
            props.put("salListenerName", "ServiceApp");

            c.setInterface(new String[]{
                IListenDataPacket.class.getName(),
                IListenTopoUpdates.class.getName(),
                IHostFinder.class.getName(),
                IfNewHostNotify.class.getName()}, props);

            c.add(createContainerServiceDependency(containerName).setService(
                    IDataPacketService.class).setCallbacks("setDataPacketService", "unsetDataPacketService").setRequired(true));
            c.add(createContainerServiceDependency(containerName).setService(
                    ITopologyManager.class).setCallbacks("setTopologyManager", "unsetTopologyMananger").setRequired(true));
            c.add(createContainerServiceDependency(containerName).setService(
                    IfHostListener.class).setCallbacks("setHostListener", "unsetHostListener").setRequired(false));
            c.add(createContainerServiceDependency(containerName).setService(
                    IfIptoHost.class).setCallbacks("setHostTracker", "unsetHostTracker").setRequired(true));
            c.add(createContainerServiceDependency(containerName).setService(
                    IFlowProgrammerService.class).setCallbacks("setFlowProgrammerService", "unsetFlowProgrammerService").setRequired(true));
            c.add(createContainerServiceDependency(containerName).setService(
                    ISwitchManager.class).setCallbacks("setSwitchManagerService", "unsetSwitchManagerService").setRequired(true));

        }
    }
}
